import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { BehaviorSubject, catchError, takeUntil, throwError } from 'rxjs';

import { BaseComponent } from 'src/app/shared';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./referrals.component.scss'],
  templateUrl: './referrals.component.html'
})
export class ReferralsComponent extends BaseComponent implements OnInit {
  error = new BehaviorSubject<string | null>(null);
  processing = new BehaviorSubject(false);
  referralLink = new BehaviorSubject<string | null>(null);
  view = new BehaviorSubject<'create' | 'loading' | 'manage' | 'error'>('loading');

  constructor(private api: ApiService) { super(); }

  ngOnInit() {
    this.api.getReferralAccount()
      .pipe(
        takeUntil(this.destroyed$),
        catchError((response: HttpErrorResponse) => {
          this.processing.next(false);

          this.error.next(response.status >= 500
            ? `There was a problem processing the request. Please email support at help@glint.info`
            : response.error.message
          );
          this.view.next('error');

          return throwError(() => response);
        })
      )
      .subscribe(response => {
        this.error.next(null);
        this.processing.next(false);

        if (response.account && response.account.signupComplete) {
          this.referralLink.next(this.getReferralLink(response.account.refersVia));
          this.view.next('manage');
        } else {
          this.referralLink.next(null);
          this.view.next('create');
        }
      });
  }

  signUp() {
    if (this.processing.value) return;

    this.processing.next(true);

    this.api.createReferralAccount()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          this.processing.next(false);

          this.error.next(response.status >= 500
            ? `There was a problem processing the request. Please email support at help@glint.info`
            : response.error.message
          );
          this.view.next('error');

          return throwError(() => response);
        })
      )
      .subscribe(result => {
        this.error.next(null);
        window.location.href = result.url;
      });
  }

  manage() {
    if (this.processing.value) return;

    this.processing.next(true);

    this.api.manageReferralAccount()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          this.processing.next(false);

          this.error.next(response.status >= 500
            ? `There was a problem processing the request. Please email support at help@glint.info`
            : response.error.message
          );
          this.view.next('error');

          return throwError(() => response);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(result => {
        this.error.next(null);
        window.location.href = result.url;
      });
  }

  copyReferralLink(tooltip: MatTooltip) {
    if (this.referralLink.value)
      navigator.clipboard.writeText(this.referralLink.value).then(() => tooltip.show());
  }

  private getReferralLink = (refersVia: string) => `${location.origin}?via=${refersVia}`;
}
