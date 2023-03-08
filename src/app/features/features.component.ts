import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, combineLatest, finalize, map, startWith, throwError } from 'rxjs';

import { ApiService } from '../shared/api.service';
import { Currency, CurrencyService } from '../shared/currency.service';
import { PriceService } from '../shared/price.service';
import { AuthState, Logout } from '../state/auth.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./features.component.scss'],
  templateUrl: './features.component.html'
})
export class FeaturesComponent {
  purchaseError = new BehaviorSubject<string | null>(null);
  frequencyControl = new FormControl<'month' | 'year'>('year', { nonNullable: true });
  currencyControl = new FormControl<Currency>(this.currencyService.getCurrency(), { nonNullable: true });
  price = combineLatest([
    this.frequencyControl.valueChanges.pipe(startWith(this.frequencyControl.value)),
    this.currencyControl.valueChanges.pipe(startWith(this.currencyControl.value))
  ]).pipe(
    map(([frequency, currency]) => this.currencyService.getPriceText(
      currency,
      this.priceService.getPriceInfo(currency, frequency).price
    ))
  );
  currencies = this.currencyService.currencies;
  purchaseInProgress = new BehaviorSubject(false);

  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private store: Store,
    private api: ApiService,
    private currencyService: CurrencyService,
    private priceService: PriceService
  ) {}

  buyLicense() {
    if (this.purchaseInProgress.value) return;

    this.purchaseInProgress.next(true);

    const user = this.store.selectSnapshot(AuthState.user);
    if (!user) {
      this.router.navigate(['/account']);
      return;
    }

    this.api.getSubscriptions()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 403) this.store.dispatch(new Logout()).subscribe(() => this.router.navigate(['/account']));

          this.purchaseInProgress.next(false);
          return throwError(() => response);
        })
      )
      .subscribe(({ using }) => {
        if (using.length > 0) this.router.navigate(['/account']);
        else this.purchase();
      });
  }

  private purchase() {
    this.api.purchaseSubscriptions(
      1,
      true,
      this.currencyControl.value,
      this.frequencyControl.value,
      this.route.snapshot.queryParamMap.get('via') ?? undefined
    )
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
          this.purchaseInProgress.next(false);
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.location.href = url;
      });
  }
}
