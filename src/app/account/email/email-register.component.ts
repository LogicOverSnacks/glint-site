import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, finalize, map } from 'rxjs';
import { ContainerComponent } from 'src/app/shared/container.component';

import { environment } from 'src/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

    ContainerComponent
  ],
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
      color: mat.m2-get-color-from-palette(theme.$app-primary-palette, 300);
      cursor: pointer;
    }

    .submit-btn {
      margin-top: 10px;

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
      <header class="mat-headline-3 title" i18n>Register</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="register()" [formGroup]="form">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Email</mat-label>
            <input type="email" matInput required formControlName="email" placeholder="Enter your email address..." i18n-placeholder>
            <mat-error *ngIf="form.controls['email'].hasError('email')" i18n>
              Invalid email address
            </mat-error>
            <mat-error *ngIf="form.controls['email'].hasError('server')">
              {{ form.controls['email'].getError('server').join(', ') }}
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Password</mat-label>
            <input matInput
              [attr.type]="(passwordHidden | async) ? 'password' : 'text'"
              required
              formControlName="password"
              placeholder="Choose a password..."
              i18n-placeholder
            >
            <button type="button"
              matSuffix
              mat-icon-button
              [matTooltip]="(passwordTooltip | async) ?? ''"
              (click)="passwordHidden.next(!passwordHidden.value)"
            >
              <mat-icon>{{passwordHidden.value ? 'visibility' : 'visibility_off'}}</mat-icon>
            </button>
            <mat-error *ngIf="form.controls['password'].hasError('minlength')" i18n>
              Password must have at least 10 characters
            </mat-error>
            <mat-error *ngIf="form.controls['password'].hasError('server')">
              {{ form.controls['password'].getError('server').join(', ') }}
            </mat-error>
          </mat-form-field>

          <button type="submit" class="submit-btn" mat-stroked-button [disabled]="processing">
            <mat-spinner *ngIf="processing" diameter="18"></mat-spinner> <ng-container i18n>Create account</ng-container>
          </button>
        </form>

        <h3 *ngSwitchCase="'success'" i18n>
          New account created!<br>
          Please click the link in your email to confirm your registration.<br>
          Click <a routerLink="/account/email/login" [queryParams]="purchase ? { purchase: true } : {}">here</a> to login.
        </h3>

        <h3 *ngSwitchCase="'error'">
          <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
          <ng-container i18n>
            Sorry! Something went wrong.<br>
            Please click <span class="reset" (click)="reset()">here</span> to try again.<br>
            If the problem persists please <a routerLink="/contact">contact us</a>.
          </ng-container>
        </h3>
      </ng-container>
    </app-container>
  `
})
export class EmailRegisterComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10)])
  });
  view = new BehaviorSubject<'init' | 'success' | 'error'>('init');
  passwordHidden = new BehaviorSubject(true);
  passwordTooltip = this.passwordHidden.pipe(map(hidden => hidden ? $localize`Show` : $localize`Hide`));
  processing = false;
  purchase = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.purchase = !!this.route.snapshot.queryParams.purchase;
  }

  register() {
    if (this.processing) return;

    this.processing = true;

    const email = this.form.controls.email.value;
    const password = this.form.controls.password.value;

    this.http
      .post(`${environment.apiBaseUrl}/auth/email/register`, { email, password })
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 400 && response.error.reason === 'validation') {
            const emailErrors: string[] = [];
            const passwordErrors: string[] = [];

            for (const error of response.error.errors) {
              if (error.param === 'email')
                emailErrors.push(error.msg);
              else if (error.param === 'password')
                passwordErrors.push(error.msg);
            }

            this.form.controls.email.setErrors(emailErrors.length > 0 ? { server: emailErrors } : null);
            this.form.controls.password.setErrors(passwordErrors.length > 0 ? { server: passwordErrors } : null);
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
      .subscribe(() => {
        this.view.next('success');
      });
  }

  reset() {
    this.form.reset();
    this.view.next('init');
  }
}
