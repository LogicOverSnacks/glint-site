import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, catchError, combineLatest, finalize, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

import { BaseComponent } from '../../shared';
import { ApiService } from '../../shared/api.service';
import { Currency, CurrencyService } from '../../shared/currency.service';
import { PriceService } from '../../shared/price.service';
import { AuthSubscription } from '../../shared/models/subscriptions';
import { AuthState, Logout } from '../../state/auth.state';
import { UserVm } from '../../state/user.vm';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContainerComponent } from 'src/app/shared/container.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,

    ContainerComponent
  ],
  standalone: true,
  styleUrls: ['./manage-account.component.scss'],
  templateUrl: './manage-account.component.html'
})
export class ManageAccountComponent extends BaseComponent implements OnInit {
  @Select(AuthState.user)
  user!: Observable<UserVm>;

  totalPurchased = 0;
  assigned: AuthSubscription[] = [];
  using: string[] = [];
  yourSubscription: string | null = null;
  initialLoad = true;

  processing = new BehaviorSubject(false);
  processingAssignedSubscription: Record<string, boolean> = {};
  quantityControl = new FormControl<number | null>(null, [
    Validators.min(1),
    Validators.max(99),
    Validators.pattern(/^\d{1,3}$/),
    Validators.required
  ]);
  frequencyControl = new FormControl<'month' | 'year'>('year', { nonNullable: true });
  currencyControl = new FormControl<Currency>(this.currencyService.getCurrency(), { nonNullable: true });
  calculationText = combineLatest([
    this.quantityControl.valueChanges.pipe(startWith(this.quantityControl.value)),
    this.frequencyControl.valueChanges.pipe(startWith(this.frequencyControl.value)),
    this.currencyControl.valueChanges.pipe(startWith(this.currencyControl.value))
  ]).pipe(
    map(([quantity, frequency, currency]) => {
      if (quantity === null || quantity <= 0 || quantity > 99 || !Number.isInteger(quantity)) return null;

      const { price } = this.priceService.getPriceInfo(currency, frequency);
      const priceText = this.currencyService.getPriceText(currency, price);
      const totalPriceText = this.currencyService.getPriceText(currency, price * (quantity ?? 0));

      return `${quantity} x ${priceText} = ${totalPriceText} / ${frequency}`;
    })
  );
  currencies = this.currencyService.currencies;
  assignEmailControl = new FormControl<string | null>(null, Validators.email);
  purchaseError = new BehaviorSubject<string | null>(null);
  manageError = new BehaviorSubject<string | null>(null);
  refresh$ = new Subject<void>();

  isXs = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(state => state.matches));
  isLg = this.breakpointObserver.observe([Breakpoints.Large]).pipe(map(state => state.matches));
  isXl = this.breakpointObserver.observe([Breakpoints.XLarge]).pipe(map(state => state.matches));
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private store: Store,
    private api: ApiService,
    private currencyService: CurrencyService,
    private priceService: PriceService
  ) { super(); }

  ngOnInit() {
    combineLatest([this.user, this.refresh$])
      .pipe(
        tap(() => {
          if (this.initialLoad) {
            this.processing.next(true);
            this.initialLoad = false;
          }
        }),
        switchMap(() => this.api.getSubscriptions()),
        catchError((response: HttpErrorResponse) => {
          this.processing.next(false);
          if (response.status === 403) this.logout();

          return throwError(() => response);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ totalPurchased, assigned, using }) => {
        this.processing.next(false);
        this.totalPurchased = totalPurchased;

        const now = new Date();
        this.assigned = assigned.filter(subscription => new Date(subscription.expiryDate) > now);
        this.using = using;
        this.yourSubscription = using.length > 0 ? using[0] : null;
        this.cdr.markForCheck();
      });

    const assign = this.route.snapshot.queryParamMap.get('assign');
    const user = this.store.selectSnapshot(AuthState.user);
    if (assign === 'self' && user) this.assign(user.email, true);

    if (user && user.confirmed) {
      this.refresh$.next();
    } else if (user) {
      this.store.dispatch(new Logout());
      this.router.navigate(['/account/email/not-confirmed'], { queryParams: { email: user.email } });
    } else {
      this.router.navigate(['/account/login']);
    }
  }

  purchase(forSelf: boolean) {
    if (this.processing.value || !this.quantityControl.value) return;

    this.processing.next(true);

    this.api.purchaseSubscriptions(
      this.quantityControl.value,
      forSelf,
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

          if (code === '403PA') {
            this.router.navigate(['/account/email/not-confirmed']);
          } else {
            this.purchaseError.next(
              `There was a problem processing the request. Please email support at help@glint.info quoting code ${code}.`
            );
          }

          this.processing.next(false);

          return throwError(() => response);
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.location.href = url;
        else this.processing.next(false);
      });
  }

  manage() {
    if (this.processing.value) return;

    this.processing.next(true);

    this.api.manageSubscriptions()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 400 && response.error.reason === 'invalid') {
            this.manageError.next(`You have no payment details to manage. Please purchase a subscription first.`);
            return throwError(() => response);
          }

          const code = response.status === 400 ? '400MA'
            : response.status === 403 ? '403MA'
            : '500MA';

          this.manageError.next(
            `There was a problem processing the request. Please email support at help@glint.info quoting code ${code}.`
          );
          this.processing.next(false);

          return throwError(() => response);
        })
      )
      .subscribe(url => {
        this.manageError.next(null);
        if (url) window.location.href = url;
        else this.processing.next(false);
      });
  }

  assign(email: string | null, self = false) {
    if (this.processing.value || !email) return;
    if (this.processingAssignedSubscription[email]) return;

    this.processingAssignedSubscription[email] = true;
    this.cdr.markForCheck();

    this.api.assignSubscription(email)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 400) {
            const errors: string[] = [];

            for (const error of response.error.errors)
              if (error.param === 'email') errors.push(error.msg);

            this.assignEmailControl.setErrors(errors.length > 0 ? { server: errors } : null);
          } else if (response.status === 403) {
            this.assignEmailControl.setErrors({
              // eslint-disable-next-line max-len
              server: ['Unable to find available subscriptions, please check your payment settings are in working order by clicking the Manage Payments button above. If the problem persists email help@glint.info for support.']
            });
          }

          if (this.totalPurchased <= this.assigned.length) {
            // in this case, the errors are not visible as the assign email form is hidden
            this.snackBar.open(this.assignEmailControl.getError('server').join(', '), 'Close', { panelClass: 'error' });
          }

          this.cdr.markForCheck();
          return throwError(() => response);
        }),
        finalize(() => {
          delete this.processingAssignedSubscription[email];
          this.cdr.markForCheck();
        })
      )
      .subscribe(() => {
        this.refresh$.next();
        this.snackBar.open(
          self
            ? `Thank you for your purchase! You will need to logout of Glint and back in again to activate.`
            : `Subscription assigned for '${email}'. The user needs to logout of Glint and back in again to activate.`,
          'Close',
          { panelClass: 'success' }
        );
      });
  }

  unassign(subscription: AuthSubscription) {
    if (this.processing.value) return;
    if (this.processingAssignedSubscription[subscription.email]) return;

    this.processingAssignedSubscription[subscription.email] = true;
    this.cdr.markForCheck();

    this.api.unassignSubscription(subscription.email)
      .pipe(finalize(() => {
        delete this.processingAssignedSubscription[subscription.email];
        this.cdr.markForCheck();
      }))
      .subscribe(() => {
        this.refresh$.next();
      });
  }

  logout() {
    this.store.dispatch(new Logout()).subscribe(() => {
      this.router.navigate(['/account/login']);
    });
  }
}
