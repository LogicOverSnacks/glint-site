import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, catchError, combineLatest, finalize, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';

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
  bestSubscription: string | null = null;

  processing = false;
  assignEmailControl = new FormControl(null, Validators.email);
  purchaseError = new BehaviorSubject<string | null>(null);
  refresh$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private store: Store,
    private api: ApiService
  ) { super(); }

  ngOnInit() {
    combineLatest([this.user, this.refresh$])
      .pipe(
        switchMap(() => this.api.getSubscriptions()),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ totalPurchased, assigned, using }) => {
        this.totalPurchased = totalPurchased;

        const now = new Date();
        this.assigned = assigned.filter(subscription => new Date(subscription.expiryDate) > now);
        this.using = using;
        this.bestSubscription = using.length > 0 ? using[0] : null;
        this.cdr.markForCheck();
      });

    if (this.store.selectSnapshot(AuthState.user)) {
      this.refresh$.next();
    } else {
      this.router.navigate(['/account/login']);
    }
  }

  purchase(quantity: number) {
    if (this.processing) return;

    this.processing = true;

    this.api.purchaseSubscriptions(quantity)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const code = response.status === 400 && response.error.reason === 'validation' ? '400PA'
            : response.status === 400 ? '400PB'
            : '500PA';

          this.purchaseError.next(
            `There was a problem processing the request. Please email support at help@glint.info quoting code ${code}`
          );

          return throwError(() => response);
        }),
        finalize(() => {
          this.processing = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.open(url);
      });
  }

  manage() {
    if (this.processing) return;

    this.processing = true;

    this.api.manageSubscriptions()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const code = response.status === 400 ? '400MA'
            : response.status === 403 ? '403MA'
            : '500MA';

          this.purchaseError.next(
            `There was a problem processing the request. Please email support at help@glint.info quoting code ${code}`
          );

          return throwError(() => response);
        }),
        finalize(() => {
          this.processing = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.open(url);
      });
  }

  assign(email: string) {
    if (this.processing) return;

    this.processing = true;

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
              server: ['Unable to find available subscriptions, please check your payment settings are in working order by clicking the button above. If the problem persists email support at help@glint.info']
            });
          }

          return throwError(() => response);
        }),
        finalize(() => {
          this.processing = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(() => {
        this.refresh$.next();
      });
  }

  unassign(subscription: AuthSubscription) {
    if (this.processing) return;

    this.processing = true;

    this.api.unassignSubscription(subscription.email)
      .pipe(finalize(() => {
        this.processing = false;
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
