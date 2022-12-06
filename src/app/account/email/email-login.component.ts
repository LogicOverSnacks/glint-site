import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UpdateUser } from 'src/app/state/auth.state';
import { UserVm } from 'src/app/state/user.vm';
import { environment } from 'src/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .form-field {
      min-width: 250px;
      max-width: 400px;
      width: 100%;
      margin-bottom: 10px;
    }

    a, .reset {
      color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
      cursor: pointer;
    }

    .submit-btn {
      margin-top: 10px;
      margin-bottom: 40px;

      mat-spinner {
        display: inline-block;
        vertical-align: top;
        margin-left: -4px;
        margin-right: 8px;
      }
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `],
  template: `
    <app-container>
      <header class="mat-headline-3 title">Login</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="login()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Email</mat-label>
            <input type="email" matInput required [formControl]="emailControl" placeholder="Enter your email address...">
            <mat-error *ngIf="emailControl.hasError('invalid')">
              Invalid email address
            </mat-error>
            <mat-error *ngIf="emailControl.hasError('server')">
              {{ emailControl.getError('server').join(', ') }}
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput
              [attr.type]="(passwordHidden | async) ? 'password' : 'text'"
              required
              [formControl]="passwordControl"
              placeholder="Enter your password..."
            >
            <button type="button"
              matSuffix
              mat-icon-button
              [matTooltip]="(passwordHidden | async) ? 'Show' : 'Hide'"
              (click)="passwordHidden.next(!passwordHidden.value)"
            >
              <mat-icon>{{passwordHidden.value ? 'visibility' : 'visibility_off'}}</mat-icon>
            </button>
            <mat-error *ngIf="passwordControl.hasError('invalid')">
              Password must have at least 10 characters
            </mat-error>
            <mat-error *ngIf="passwordControl.hasError('server')">
              {{ passwordControl.getError('server').join(', ') }}
            </mat-error>
          </mat-form-field>

          <button type="submit" class="submit-btn" mat-stroked-button [disabled]="processing">
            <mat-spinner *ngIf="processing" diameter="18"></mat-spinner> Login
          </button>

          <p>Forgot your password? Click <a routerLink="/account/email/lost-password">here</a> to reset it.</p>
          <p>Don't have an account? Click <a routerLink="/account/email/register">here</a> to register.</p>
        </form>

        <h3 *ngSwitchCase="'success'">
          Logged in successfully!<br>
          Redirecting...
        </h3>

        <h3 *ngSwitchCase="'error'">
          <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
          Sorry! Something went wrong.<br>
          Please click <span class="reset" (click)="reset()">here</span> to try again.<br>
          If the problem persists please <a routerLink="/contact">contact us</a>.
        </h3>
      </ng-container>
    </app-container>
  `
})
export class EmailLoginComponent {
  emailControl = new FormControl<string | null>(null, [Validators.required, Validators.email]);
  passwordControl = new FormControl<string | null>(null, [Validators.required, Validators.minLength(10)]);
  view = new BehaviorSubject<'init' | 'success' | 'error'>('init');
  passwordHidden = new BehaviorSubject(true);
  processing = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  login() {
    if (this.processing) return;

    this.processing = true;

    this.http
      .post<{ user: UserVm; }>(`${environment.apiBaseUrl}/auth/email/login`, {
        email: this.emailControl.value,
        password: this.passwordControl.value
      })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 400) {
            const emailErrors: string[] = [];
            const passwordErrors: string[] = [];

            for (const error of response.error.errors) {
              if (error.param === 'email')
                emailErrors.push(error.msg);
              else if (error.param === 'password')
                passwordErrors.push(error.msg);
            }

            this.emailControl.setErrors(emailErrors.length > 0 ? { server: emailErrors } : null);
            this.passwordControl.setErrors(passwordErrors.length > 0 ? { server: passwordErrors } : null);
          } else {
            this.view.next('error');
          }

          return EMPTY;
        }),
        finalize(() => {
          this.processing = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(({ user }) => {
        this.view.next('success');
        this.store.dispatch(new UpdateUser(user)).subscribe(() => {
          this.router.navigate(['/account']);
        });
      });
  }

  reset() {
    this.emailControl.reset();
    this.passwordControl.reset();
    this.view.next('init');
  }
}
