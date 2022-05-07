import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { catchError, combineLatest, finalize, Observable, startWith, Subject, switchMap, takeUntil, throwError } from 'rxjs';

import { BaseComponent } from '../../shared';
import { ApiService } from '../../shared/api.service';
import { AuthSubscription } from '../../shared/models/subscriptions';
import { AuthState } from '../../state/auth.state';
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
  using: AuthSubscription[] = [];
  bestSubscription: AuthSubscription | null = null;

  assigning = false;
  assignEmailControl = new FormControl(null, Validators.email);
  refresh$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private api: ApiService
  ) { super(); }

  ngOnInit() {
    combineLatest([this.user, this.refresh$.pipe(startWith(undefined))])
      .pipe(
        switchMap(() => this.api.getSubscriptions()),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ totalPurchased, assigned, using }) => {
        this.totalPurchased = totalPurchased;

        const now = new Date();
        this.assigned = assigned
          .filter(subscription => !subscription.expiryDate || new Date(subscription.expiryDate) > now);
        this.using = using;
        this.bestSubscription = using.length > 0 ? using[0] : null;
        this.cdr.markForCheck();
      });
  }

  assign(email: string) {
    if (this.assigning) return;

    this.assigning = true;
    this.api.assignSubscription(email)
      .pipe(finalize(() => {
        this.assigning = false;
      }))
      .subscribe(() => {
        this.refresh$.next();
      });
  }

  unassign(subscription: AuthSubscription) {
    if (this.assigning) return;

    this.assigning = true;
    this.api.unassignSubscription(subscription.email)
      .pipe(finalize(() => {
        this.assigning = false;
      }))
      .subscribe(() => {
        this.refresh$.next();
      });
  }
}
