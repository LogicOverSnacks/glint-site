import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, catchError, combineLatest, finalize, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BaseComponent } from '../../shared';
import { ApiService } from '../../shared/api.service';
import { AuthSubscription } from '../../shared/models/subscriptions';
import { AuthState, Logout } from '../../state/auth.state';
import { UserVm } from '../../state/user.vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  processing = new BehaviorSubject(true);
  quantityControl = new FormControl(null, [Validators.min(1), Validators.max(99)]);
  assignEmailControl = new FormControl(null, Validators.email);
  purchaseError = new BehaviorSubject<string | null>(null);
  manageError = new BehaviorSubject<string | null>(null);
  refresh$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private api: ApiService
  ) { super(); }

  ngOnInit() {
    const assign = this.route.snapshot.queryParamMap.get('assign');
    if (assign === 'self') {
      const user = this.store.selectSnapshot(AuthState.user);
      if (user) this.assign(user.email);
    }

    combineLatest([this.user, this.refresh$])
      .pipe(
        tap(() => {
          this.processing.next(true);
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

    if (this.store.selectSnapshot(AuthState.user))
      this.refresh$.next();
    else
      this.router.navigate(['/account/login']);
  }

  purchase(quantity: number, forSelf: boolean) {
    if (this.processing.value) return;

    this.processing.next(true);

    this.api.purchaseSubscriptions(quantity, forSelf)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const code = response.status === 400 && response.error.reason === 'validation' ? '400PA'
            : response.status === 400 ? '400PB'
            : '500PA';

          this.purchaseError.next(
            `There was a problem processing the request. Please email support at help@glint.info quoting code ${code}.`
          );
          this.processing.next(false);

          return throwError(() => response);
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.location.href = url;
        else this.processing.next(false);
        // TODO: after successful purchase, tell the user that they need to log out and back in again
      });
  }

  manage() {
    if (this.processing.value) return;

    this.processing.next(true);

    this.api.manageSubscriptions()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 403 && response.error.reason === 'invalid') {
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

  assign(email: string) {
    if (this.processing.value) return;

    this.processing.next(true);

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

          return throwError(() => response);
        }),
        finalize(() => {
          this.processing.next(false);
        })
      )
      .subscribe(() => {
        this.refresh$.next();
      });
  }

  unassign(subscription: AuthSubscription) {
    if (this.processing.value) return;

    this.processing.next(true);

    this.api.unassignSubscription(subscription.email)
      .pipe(finalize(() => {
        this.processing.next(false);
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
