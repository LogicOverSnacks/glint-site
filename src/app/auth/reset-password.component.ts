import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BaseComponent } from '../shared';
import { ContainerComponent } from '../shared/container.component';

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
    MatTooltipModule,

    ContainerComponent
  ],
  standalone: true,
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }

    .title { margin-bottom: 50px; }

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

    .password-visibility-btn { margin-right: 10px; }
    .submit-btn { margin-top: 10px; }
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `],
  template: `
    <app-container>
      <header class="mat-headline-3 title" i18n>Reset Password</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="resetPassword()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Security code</mat-label>
            <input matInput required [formControl]="codeControl">
            <mat-error *ngIf="codeControl.hasError('pattern')" i18n>
              Please enter a valid security code
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Password</mat-label>
            <input matInput
              [attr.type]="(passwordHidden | async) ? 'password' : 'text'"
              required
              [formControl]="passwordControl"
              placeholder="Enter your password..."
              i18n-placeholder
            >
            <button type="button"
              class="password-visibility-btn"
              matSuffix
              mat-icon-button
              [matTooltip]="(passwordTooltip | async) ?? ''"
              (click)="passwordHidden.next(!passwordHidden.value)"
            >
              <mat-icon>{{passwordHidden.value ? 'visibility' : 'visibility_off'}}</mat-icon>
            </button>
            <mat-error *ngIf="passwordControl.hasError('minlength')" i18n>
              Password must have at least 10 characters
            </mat-error>
          </mat-form-field>

          <div>
            <button type="submit" class="submit-btn" mat-stroked-button i18n>Reset password</button>
          </div>
        </form>

        <ng-container *ngSwitchCase="'processing'">
          <h3 i18n>Processing...</h3>
        </ng-container>

        <ng-container *ngSwitchCase="'success'">
          <h3 i18n>
            Password changed!<br>
            You can now close this window and login to Glint.
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'expired'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            <ng-container i18n>
              This security code has expired.<br>
              Please click <span class="reset" (click)="requestNewCode()">here</span> to request a new one.
            </ng-container>
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'invalid'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            <ng-container i18n>
              This security code is invalid, please try again, or confirm your email address to request a new code:
            </ng-container>
          </h3>

          <form (ngSubmit)="requestNewCode()">
            <mat-form-field class="form-field" appearance="outline">
              <mat-label i18n>Email</mat-label>
              <input type="email" matInput required [formControl]="emailControl">
              <mat-error *ngIf="emailControl.hasError('email')" i18n>
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <div>
              <button type="submit" class="submit-btn" mat-stroked-button i18n>Request a new code</button>
            </div>
          </form>
        </ng-container>

        <ng-container *ngSwitchCase="'error'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            <ng-container i18n>
              Sorry! Something went wrong.<br>
              Please click <a [routerLink]="['/auth/register']">here</a> to try again.<br>
              If the problem persists please <a routerLink="/contact">contact us</a>.
            </ng-container>
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
    Validators.minLength(10),
    Validators.required
  ]);
  view = new BehaviorSubject<'init' | 'processing' | 'success' | 'expired' | 'invalid' | 'error'>('init');
  passwordHidden = new BehaviorSubject(true);
  passwordTooltip = this.passwordHidden.pipe(map(hidden => hidden ? $localize`Show` : $localize`Hide`));

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
      .post(`${environment.apiBaseUrl}/auth/email/reset-password`, {
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
