import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { catchError, combineLatest, finalize, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';

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
    combineLatest([this.user, this.refresh$])
      .pipe(
        switchMap(() => this.api.getSubscriptions()),
        catchError(error => {
          this.router.navigate(['/account/unauthorized']);
          return throwError(() => error);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ totalPurchased, assigned, using }) => {
        this.totalPurchased = totalPurchased;
        this.assigned = assigned;
        this.using = using;
        this.bestSubscription = using.length > 0 ? using[0] : null;
        this.cdr.markForCheck();
      });
  }

  assign() {
    if (this.assigning) return;

    this.assigning = true;
    this.api.assignSubscription(this.assignEmailControl.value)
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
