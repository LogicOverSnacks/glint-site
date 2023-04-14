import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ContainerComponent } from 'src/app/shared/container.component';

import { environment } from 'src/environments/environment';
import { BaseComponent } from '../../shared';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,

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

    a, .reset {
      color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
      cursor: pointer;
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `],
  template: `
    <app-container>
      <header class="mat-headline-3 title" i18n>Email Not Confirmed</header>

      <ng-container [ngSwitch]="view | async">
        <ng-container *ngSwitchCase="'init'">
          <h3 i18n>
            Your email has not yet been confirmed.<br>
            Please check your email for the confirmation link, including in any spam folders.<br>
            Please click <span class="reset" (click)="requestNewCode()">here</span> to resend the confirmation email.<br>
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'processing'">
          <h3 i18n>Processing...</h3>
        </ng-container>

        <ng-container *ngSwitchCase="'invalid'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            <ng-container i18n>
              The email '{{email}}' is already confirmed or doesn't have an account associated with it.<br>
              Please click <a routerLink="/account/login">here</a> to login.<br>
            </ng-container>
          </h3>
        </ng-container>

        <ng-container *ngSwitchCase="'error'">
          <h3>
            <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
            <ng-container i18n>
              Sorry! Something went wrong.<br>
              Please click <span class="reset" (click)="requestNewCode()">here</span> to try again.<br>
              If the problem persists please <a routerLink="/contact">contact us</a>.
            </ng-container>
          </h3>
        </ng-container>
      </ng-container>
    </app-container>
  `
})
export class EmailNotConfirmedComponent extends BaseComponent implements OnInit {
  email!: string;
  view = new BehaviorSubject<'init' | 'processing' | 'invalid' | 'error'>('init');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { super(); }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        if (params.email)
          this.email = params.email;
        else
          this.router.navigate(['/account/login']);
      });
  }

  requestNewCode() {
    if (!this.email) {
      this.router.navigate(['/account/login']);
      return;
    }

    if (this.view.value === 'processing') return;

    this.view.next('processing');

    this.http
      .post(`${environment.apiBaseUrl}/auth/email/request-confirm`, {
        email: this.email
      })
      .pipe(
        catchError(error => {
          if (error.reason === 'invalid') this.view.next('invalid');
          else this.view.next('error');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.router.navigate(['/auth/confirm-email'], { queryParams: { email: this.email } });
      });
  }
}
