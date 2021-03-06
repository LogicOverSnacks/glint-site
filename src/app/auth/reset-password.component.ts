import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BaseComponent } from '../shared';

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
      a, .reset {
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
        cursor: pointer;
      }
    `,
    `.submit-btn { margin-top: 10px; }`,
    `.error-icon { font-size: 48px; }`
  ],
  template: `
    <app-container>
      <header class="mat-display-2 title">Reset Password</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="resetPassword()">
          <mat-form-field class="form-field">
            <mat-label>Security code</mat-label>
            <input matInput required [formControl]="codeControl">
            <mat-error *ngIf="codeControl.hasError('pattern')">
              Please enter a valid security code
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field">
            <mat-label>Password</mat-label>
            <input matInput required [formControl]="passwordControl">
            <mat-error *ngIf="passwordControl.hasError('pattern')">
              Please enter a strong password with these rules:
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
            Password changed!<br>
            You can now close this window and login to Glint.
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'expired'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            This security code has expired.<br>
            Please click <span class="reset" (click)="requestNewCode()">here</span> to request a new one.
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'invalid'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            This security code is invalid, please try again, or confirm your email address to request a new code:
          </h3>

          <form (ngSubmit)="requestNewCode()">
            <mat-form-field class="form-field">
              <mat-label>Email</mat-label>
              <input type="email" matInput required [formControl]="emailControl">
              <mat-error *ngIf="emailControl.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <div>
              <button type="submit" class="submit-btn" mat-stroked-button>Request a new code</button>
            </div>
          </form>
        </ng-container>

        <ng-container *ngSwitchCase="'error'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            Sorry! Something went wrong.<br>
            Please click <a [routerLink]="['/auth/register']">here</a> to try again.<br>
            If the problem persists please contact support at <a href="mailto:help@glint.info">help@glint.info</a>.
          </h3>
        </ng-container>
      </ng-container>
    </app-container>
  `
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  codeControl = new FormControl<string | null>(null, [
    Validators.pattern(/^[a-fA-F0-9]{8}$/),
    Validators.required
  ]);
  emailControl = new FormControl<string | null>(null, [
    Validators.email,
    Validators.required
  ]);
  passwordControl = new FormControl<string | null>(null, [
    Validators.pattern(/password/),
    Validators.required
  ]);
  view = new BehaviorSubject<'init' | 'processing' | 'success' | 'expired' | 'invalid' | 'error'>('init');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { super(); }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        if (params.code)
          this.codeControl.setValue(params.code);

        if (params.email)
          this.emailControl.setValue(params.email);

        if (this.emailControl.invalid)
          this.view.next('invalid');
      });
  }

  resetPassword() {
    if (this.codeControl.invalid || this.emailControl.invalid || this.passwordControl.invalid) return;
    if (this.view.value === 'processing') return;

    this.view.next('processing');

    this.http
      .post(`${environment.apiBaseUrl}/auth/email/confirm`, {
        email: this.emailControl.value,
        password: this.passwordControl.value,
        lostPasswordCode: this.codeControl.value
      })
      .pipe(
        catchError(error => {
          if (error.reason === 'expired') this.view.next('expired');
          else if (error.reason === 'invalid') this.view.next('invalid');
          else this.view.next('error');

          return EMPTY;
        })
      )
      .subscribe(() => {
        this.view.next('success');
      });
  }

  requestNewCode() {
    if (this.emailControl.invalid) return;
    if (this.view.value === 'processing') return;

    this.view.next('processing');

    this.http
      .post(`${environment.apiBaseUrl}/auth/email/lost-password`, {
        email: this.emailControl.value
      })
      .pipe(
        catchError(() => {
          this.view.next('error');

          return EMPTY;
        })
      )
      .subscribe(() => {
        this.view.next('init');
      });
  }
}
