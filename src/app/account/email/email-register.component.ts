import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';

import { ApiBaseUrl } from 'src/app/shared';
import { Login } from 'src/app/state/auth.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `.title { margin-bottom: 50px; }`,
    `form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }`,
    `.form-field {
      min-width: 250px;
      max-width: 400px;
      width: 100%;
      margin-bottom: 10px;
    }`,
    `
      @use '@angular/material' as mat;
      @use 'src/theme' as theme;
      a, .reset { color: mat.get-color-from-palette(theme.$app-primary-palette, 400); }
    `,
    `.submit-btn { margin-top: 10px; }`,
    `.error-icon { font-size: 48px; }`
  ],
  template: `
    <app-container>
      <header class="mat-display-2 title">Register</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="register()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Email</mat-label>
            <input type="email" matInput required [formControl]="emailControl" placeholder="Enter your email address...">
            <mat-error *ngIf="emailControl.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field" appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput
              [attr.type]="(passwordHidden | async) ? 'password' : 'text'"
              required
              [formControl]="passwordControl"
              placeholder="Choose a password..."
            >
            <button type="button"
              matSuffix
              mat-icon-button
              [title]="(passwordHidden | async) ? 'Show' : 'Hide'"
              (click)="passwordHidden.next(!passwordHidden.value)"
            >
              <mat-icon>{{passwordHidden.value ? 'visibility' : 'visibility_off'}}</mat-icon>
            </button>
            <mat-error *ngIf="passwordControl.hasError('pattern')">
              Please enter a strong password with these rules:
            </mat-error>
          </mat-form-field>

          <div>
            <button type="submit" class="submit-btn" mat-stroked-button>Create account</button>
          </div>
        </form>

        <h3 *ngSwitchCase="'processing'">Processing...</h3>

        <h3 *ngSwitchCase="'success'">
          New account created!<br>
          Please click the link in your email to confirm your registration.
        </h3>

        <h3 *ngSwitchCase="'error'">
          <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
          Sorry! Something went wrong.<br>
          Please click <span class="reset" (click)="reset()">here</span> to try again.<br>
          If the problem persists please contact support at <a href="mailto:help@glint.info">help@glint.info</a>.
        </h3>
      </ng-container>
    </app-container>
  `
})
export class EmailRegisterComponent {
  emailControl = new FormControl();
  passwordControl = new FormControl();
  view = new BehaviorSubject<'init' | 'processing' | 'success' | 'error'>('init');
  passwordHidden = new BehaviorSubject(true);

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  register() {
    if (this.view.value === 'processing') return;

    this.view.next('processing');

    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    this.http
      .post(`${ApiBaseUrl}/auth/email/register`, { email, password })
      .pipe(
        catchError(() => {
          this.view.next('error');

          return EMPTY;
        })
      )
      .subscribe(() => {
        this.store.dispatch(new Login(email, password)).subscribe(() => {
          // TODO: redirect to logged in account page
        });
        this.view.next('success');
      });
  }

  reset() {
    this.emailControl.reset();
    this.passwordControl.reset();
    this.view.next('init');
  }
}
