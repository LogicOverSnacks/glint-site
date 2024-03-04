import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, combineLatest, finalize, map, startWith, throwError } from 'rxjs';

import { ApiService } from '../shared/api.service';
import { ContainerComponent } from '../shared/container.component';
import { Currency, CurrencyService } from '../shared/currency.service';
import { PriceService } from '../shared/price.service';
import { AuthState, Logout } from '../state/auth.state';
import { FeaturesDialogComponent } from './features-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    ContainerComponent
  ],
  standalone: true,
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
    private dialog: MatDialog,
    private store: Store,
    private api: ApiService,
    private currencyService: CurrencyService,
    private priceService: PriceService
  ) {}

  openFeatureDialog(image: string) {
    this.dialog.open(FeaturesDialogComponent, { data: `/assets/features/animated/${image}.gif` });
  }

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
