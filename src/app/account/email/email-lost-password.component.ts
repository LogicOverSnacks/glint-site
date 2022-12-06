import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BaseComponent } from '../../shared';

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

    .submit-btn { margin-top: 10px; }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `],
  template: `
    <app-container>
      <header class="mat-headline-3 title">Reset Password</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="resetPassword()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput required [formControl]="emailControl">
            <mat-error *ngIf="emailControl.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <div>
            <button type="submit" class="submit-btn" mat-stroked-button>Reset password</button>
          </div>
        </form>

        <ng-container *ngSwitchCase="'processing'">
          <h3>Processing...</h3>
        </ng-container>

        <ng-container *ngSwitchCase="'success'">
          <h3>
            Please check your email, if an account has been registered with it then a password reset link has been sent.
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'error'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            Sorry! Something went wrong.<br>
            Please click <a [routerLink]="['/auth/lost-password']">here</a> to try again.<br>
            If the problem persists please <a routerLink="/contact">contact us</a>.
          </h3>
        </ng-container>
      </ng-container>
    </app-container>
  `
})
export class EmailLostPasswordComponent extends BaseComponent implements OnInit {
  emailControl = new FormControl<string | null>(null, [Validators.email, Validators.required]);
  view = new BehaviorSubject<'init' | 'processing' | 'success' | 'error'>('init');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { super(); }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        if (params.email)
          this.emailControl.setValue(params.email);
      });
  }

  resetPassword() {
    if (this.emailControl.invalid) return;
    if (this.view.value === 'processing') return;

    this.view.next('processing');

    this.http
      .post(`${environment.apiBaseUrl}/auth/email/lost-password`, { email: this.emailControl.value })
      .pipe(
        catchError(error => {
          if (error.reason === 'validation')
            this.emailControl.setErrors({ server: error.message });
          else
            this.view.next('error');

          return EMPTY;
        })
      )
      .subscribe(() => {
        this.view.next('success');
      });
  }
}
