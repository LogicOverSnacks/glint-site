import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { AuthState } from '../state/auth.state';
import { ApiBaseUrl } from '.';
import { GetSubscriptionsResponse } from './models/subscriptions';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  getSubscriptions() {
    return this.http.get<GetSubscriptionsResponse>(`${ApiBaseUrl}/subscriptions`, { headers: this.getHeaders() });
  }

  purchaseSubscriptions(priceId: string, quantity: number) {
    const user = this.store.selectSnapshot(AuthState.user);
    if (!user) throw new Error(`Must be logged in to purchase subscriptions.`);

    return this.http
      .post(
        `${ApiBaseUrl}/subscriptions/purchase`,
        {
          email: user.email,
          quantity: quantity,
          priceId: priceId
        },
        { headers: this.getHeaders() }
      )
      .pipe(
        map(() => null),
        catchError((error: HttpErrorResponse) => error.status === 303 ? of(error.url) : throwError(() => error))
      );
  }

  assignSubscription(userEmail: string) {
    return this.http
      .post(
        `${ApiBaseUrl}/subscriptions/assign`,
        { email: userEmail },
        { headers: this.getHeaders() }
      );
  }

  unassignSubscription(userEmail: string) {
    return this.http
      .post(
        `${ApiBaseUrl}/subscriptions/unassign`,
        { email: userEmail },
        { headers: this.getHeaders() }
      );
  }

  private getHeaders() {
    const user = this.store.selectSnapshot(AuthState.user);
    return user ? { 'Authorization': `Bearer ${user.accessToken}` } : undefined;
  }
}
