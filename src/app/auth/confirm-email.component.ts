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
      color: mat.m2-get-color-from-palette(theme.$app-primary-palette, 300);
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
      <header class="mat-headline-3 title" i18n>Confirm Email</header>

      <ng-container [ngSwitch]="view | async">
        <form *ngSwitchCase="'init'" (ngSubmit)="confirm()">
          <mat-form-field class="form-field" appearance="outline">
            <mat-label i18n>Security code</mat-label>
            <input matInput required [formControl]="codeControl">
            <mat-error *ngIf="codeControl.hasError('pattern')" i18n>
              Please enter a valid security code
            </mat-error>
          </mat-form-field>

          <div>
            <button type="submit" class="submit-btn" mat-stroked-button i18n>Confirm email</button>
          </div>
        </form>

        <ng-container *ngSwitchCase="'processing'">
          <h3 i18n>Processing...</h3>
        </ng-container>

        <ng-container *ngSwitchCase="'success'">
          <h3 i18n>
            Email confirmed!<br>
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
              Please click <a routerLink="/account/email/register">here</a> to try again.<br>
              If the problem persists please <a routerLink="/contact">contact us</a>.
            </ng-container>
          </h3>
        </ng-container>
      </ng-container>
    </app-container>
  `
})
export class ConfirmEmailComponent extends BaseComponent implements OnInit {
  codeControl = new FormControl<string | null>(null, [
    Validators.pattern(/^[a-fA-F0-9]{8}$/),
    Validators.required
  ]);
  emailControl = new FormControl<string | null>(null, [Validators.email, Validators.required]);
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

        if (this.codeControl.valid && this.emailControl.valid)
          this.confirm();
      });
  }

  confirm() {
    if (this.codeControl.invalid || this.emailControl.invalid) return;
    if (this.view.value === 'processing') return;

    this.view.next('processing');

    this.http
      .post(`${environment.apiBaseUrl}/auth/email/confirm`, {
        email: this.emailControl.value,
        code: this.codeControl.value?.toLowerCase()
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
      .post(`${environment.apiBaseUrl}/auth/email/request-confirm`, {
        email: this.emailControl.value
      })
      .pipe(
        catchError(error => {
          if (error.reason === 'invalid') this.view.next('error');
          else this.view.next('error');

          return EMPTY;
        })
      )
      .subscribe(() => {
        this.view.next('init');
      });
  }
}
