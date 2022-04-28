import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, finalize, takeUntil } from 'rxjs';

import { BaseComponent } from '../shared/base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `.title { margin-bottom: 50px; }`,
    `.form-field { width: 250px; }`,
    `
      @use '@angular/material' as mat;
      @use 'src/theme' as theme;
      a { color: mat.get-color-from-palette(theme.$app-primary-palette, 400); }
    `,
    `.error-icon { font-size: 48px; }`
  ],
  template: `
    <header class="mat-display-3 title">Confirm Email</header>

    <ng-container [ngSwitch]="view | async">
      <form *ngSwitchCase="'init'" (ngSubmit)="confirm()">
        <mat-form-field class="form-field">
          <mat-label>Enter the confirmation code...</mat-label>
          <input matInput [formControl]="confirmationCodeControl">
          <mat-error *ngIf="confirmationCodeControl.hasError('pattern')">
            Please enter a valid confirmation code
          </mat-error>
        </mat-form-field>

        <div>
          <button type="submit" mat-stroked-button>Submit</button>
        </div>
      </form>

      <ng-container *ngSwitchCase="'processing'">
        <h3>Processing...</h3>
      </ng-container>

      <ng-container *ngSwitchCase="'success'">
        <h3>Email confirmed!</h3>
      </ng-container>

      <ng-container *ngSwitchCase="'error'">
        <h3>
          <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
          There was an error trying to confirm your email.<br>
          Please request a new confirmation code by clicking <a href="/">here</a>.
        </h3>
      </ng-container>
    </ng-container>
  `
})
export class ConfirmEmailComponent extends BaseComponent implements OnInit {
  confirmationCodeControl = new FormControl(null, [
    Validators.pattern(/[a-fA-F0-9]{6}/)
  ]);
  email = '';
  view = new BehaviorSubject<'init' | 'processing' | 'success' | 'error'>('init');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { super(); }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        if (params['code']) {
          this.confirmationCodeControl.setValue(params['code']);
        }

        if (params['email']) {
          this.email = params['email'];
        } else {
          this.router.navigate(['/not-found']);
        }
      });
  }

  confirm() {
    this.view.next('processing');

    this.http
      .post(`https://api.glint.info/auth/email/confirm`, {
        email: this.email,
        code: (this.confirmationCodeControl.value as string).toLowerCase()
      })
      .pipe(
        catchError(() => {
          this.view.next('error');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.view.next('success');
      });
  }
}
