import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ContainerComponent } from 'src/app/shared/container.component';

import { environment } from 'src/environments/environment';
import { BaseComponent } from '../../shared';

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
      <header class="mat-headline-3 title" i18n>Reset Password</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="resetPassword()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Email</mat-label>
            <input matInput required [formControl]="emailControl">
            <mat-error *ngIf="emailControl.hasError('email')" i18n>
              Please enter a valid email
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
            Please check your email, if an account has been registered with it then a password reset link has been sent.
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'error'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            <ng-container i18n>
              Sorry! Something went wrong.<br>
              Please click <a routerLink="/account/email/lost-password">here</a> to try again.<br>
              If the problem persists please <a routerLink="/contact">contact us</a>.
            </ng-container>
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
