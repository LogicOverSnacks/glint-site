import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { Select } from '@ngxs/store';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { ApiService } from 'src/app/shared/api.service';
import { ContainerComponent } from 'src/app/shared/container.component';
import { AuthState } from 'src/app/state/auth.state';
import { UserVm } from 'src/app/state/user.vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
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
    }
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `],
  template: `
    <app-container>
      <header class="mat-headline-3 title" i18n>Change Password</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="change()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Current Password</mat-label>
            <input matInput
              [attr.type]="(passwordHidden | async) ? 'password' : 'text'"
              required
              [formControl]="passwordControl"
              placeholder="Enter your password..."
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
            <mat-error *ngIf="passwordControl.hasError('invalid')" i18n>
              Password must have at least 10 characters
            </mat-error>
            <mat-error *ngIf="passwordControl.hasError('server')">
              {{ passwordControl.getError('server').join(', ') }}
            </mat-error>
          </mat-form-field>

          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>New Password</mat-label>
            <input matInput
              [attr.type]="(newPasswordHidden | async) ? 'password' : 'text'"
              required
              [formControl]="newPasswordControl"
              placeholder="Enter a new password..."
              i18n-placeholder
            >
            <button type="button"
              matSuffix
              mat-icon-button
              [matTooltip]="(newPasswordTooltip | async)?? ''"
              i18n-matTooltip
              (click)="newPasswordHidden.next(!newPasswordHidden.value)"
            >
              <mat-icon>{{newPasswordHidden.value ? 'visibility' : 'visibility_off'}}</mat-icon>
            </button>
            <mat-error *ngIf="newPasswordControl.hasError('invalid')" i18n>
              Password must have at least 10 characters
            </mat-error>
            <mat-error *ngIf="newPasswordControl.hasError('server')">
              {{ newPasswordControl.getError('server').join(', ') }}
            </mat-error>
          </mat-form-field>

          <button type="submit" class="submit-btn" mat-stroked-button [disabled]="processing" i18n>Change password</button>

          <p i18n>
            Forgot your password? Click
            <a [routerLink]="['/account/email/lost-password']" [queryParams]="{ email: (user | async)?.email }">here</a>
            to reset it.
          </p>
        </form>

        <h3 *ngSwitchCase="'success'" i18n>
          Password changed successfully!<br>
          Redirecting...
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
export class EmailChangePasswordComponent {
  @Select(AuthState.user)
  user!: Observable<UserVm>;

  passwordControl = new FormControl<string | null>(null, [Validators.required, Validators.minLength(10)]);
  newPasswordControl = new FormControl<string | null>(null, [Validators.required, Validators.minLength(10)]);
  view = new BehaviorSubject<'init' | 'success' | 'error'>('init');
  passwordHidden = new BehaviorSubject(true);
  passwordTooltip = this.passwordHidden.pipe(map(hidden => hidden ? $localize`Show` : $localize`Hide`));
  newPasswordHidden = new BehaviorSubject(true);
  newPasswordTooltip = this.newPasswordHidden.pipe(map(hidden => hidden ? $localize`Show` : $localize`Hide`));
  processing = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private api: ApiService
  ) {}

  change() {
    if (this.processing || !this.passwordControl.value || !this.newPasswordControl.value) return;

    this.processing = true;

    this.api.changePassword(this.passwordControl.value, this.newPasswordControl.value)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 400) {
            const passwordErrors: string[] = [];
            const newPasswordErrors: string[] = [];

            for (const error of response.error.errors) {
              if (error.param === 'password')
                passwordErrors.push(error.msg);
              else if (error.param === 'newPassword')
                newPasswordErrors.push(error.msg);
            }

            this.passwordControl.setErrors(passwordErrors.length > 0 ? { server: passwordErrors } : null);
            this.newPasswordControl.setErrors(newPasswordErrors.length > 0 ? { server: newPasswordErrors } : null);
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
        this.router.navigate(['/account']);
      });
  }

  reset() {
    this.passwordControl.reset();
    this.newPasswordControl.reset();
    this.view.next('init');
  }
}
