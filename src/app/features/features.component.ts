import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, finalize, map, Observable, startWith, throwError } from 'rxjs';

import { ApiService } from '../shared/api.service';
import { CurrencyService } from '../shared/currency.service';
import { AuthState, Logout } from '../state/auth.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./features.component.scss'],
  templateUrl: './features.component.html'
})
export class FeaturesComponent {
  purchaseError = new BehaviorSubject<string | null>(null);
  price: Observable<string>;
  frequencyControl = new FormControl<'month' | 'year'>('year', { nonNullable: true });

  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  private processing = false;
  private currency: 'GBP' | 'EUR' | 'USD';

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private store: Store,
    private api: ApiService,
    currencyService: CurrencyService
  ) {
    this.currency = currencyService.getCurrency();
    this.price = this.frequencyControl.valueChanges.pipe(
      startWith(this.frequencyControl.value),
      map(frequency =>
        this.currency === 'GBP' ? frequency === 'month' ? '£4' : '£35'
        : this.currency === 'EUR' ? frequency === 'month' ? '€4' : '€35'
        : frequency === 'month' ? '$4' : '$35'
      )
    );
  }

  buyLicense() {
    const user = this.store.selectSnapshot(AuthState.user);
    if (!user) {
      this.router.navigate(['/account']);
      return;
    }

    this.api.getSubscriptions()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 403) this.store.dispatch(new Logout()).subscribe(() => this.router.navigate(['/account']));

          return throwError(() => response);
        })
      )
      .subscribe(({ using }) => {
        if (using.length > 0) this.router.navigate(['/account']);
        else this.purchase();
      });
  }

  private purchase() {
    if (this.processing) return;

    this.processing = true;

    this.api.purchaseSubscriptions(1, true, this.currency, this.frequencyControl.value)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const code = response.status === 400 && response.error.reason === 'validation' ? '400PA'
            : response.status === 400 ? '400PB'
            : response.status === 403 && response.error.reason === 'unverified' ? '403PA'
            : '500PA';

          if (code === '403PA')
            this.router.navigate(['/account/email/not-confirmed']);
          else
            this.purchaseError.next(code);

          return throwError(() => response);
        }),
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.location.href = url;
      });
  }
}
