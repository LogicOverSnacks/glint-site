import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthState, RefreshAccessToken } from 'src/app/state/auth.state';
import { UserVm } from 'src/app/state/user.vm';
import { Currency } from './currency.service';
import { GetReferralAccountResponse } from './models/referrals';
import { GetSubscriptionsResponse } from './models/subscriptions';
import { PriceService } from './price.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private static readonly retries = 2;

  constructor(
    private http: HttpClient,
    private store: Store,
    private priceService: PriceService
  ) {}

  changePassword(password: string, newPassword: string) {
    return this.withRetries(() => this.http.post(
      `${environment.apiBaseUrl}/auth/email/change-password`,
      { password, newPassword },
      { headers: this.getHeaders() }
    ));
  }

  getSubscriptions() {
    return this.withRetries(() => this.http.get<GetSubscriptionsResponse>(
      `${environment.apiBaseUrl}/subscriptions`,
      { headers: this.getHeaders() }
    ));
  }

  purchaseSubscriptions(
    quantity: number,
    forSelf: boolean,
    currency: Currency,
    frequency: 'month' | 'year' = 'month',
    via?: string
  ): Observable<string | null> {
    const { priceId } = this.priceService.getPriceInfo(currency, frequency);

    return this.withRetries(() => this.http
      .post<{ url: string; }>(
        `${environment.apiBaseUrl}/subscriptions/purchase`,
        { priceId, quantity, forSelf, via },
        { headers: this.getHeaders() }
      )
      .pipe(map(({ url }) => url))
    );
  }

  manageSubscriptions(): Observable<string | null> {
    return this.withRetries(() => this.http
      .post<{ url: string; }>(
        `${environment.apiBaseUrl}/subscriptions/manage`,
        null,
        { headers: this.getHeaders() }
      )
      .pipe(map(({ url }) => url))
    );
  }

  assignSubscription(userEmail: string): Observable<any> {
    return this.withRetries(() => this.http.post(
      `${environment.apiBaseUrl}/subscriptions/assign`,
      { email: userEmail },
      { headers: this.getHeaders() }
    ));
  }

  unassignSubscription(userEmail: string): Observable<any> {
    return this.withRetries(() => this.http.post(
      `${environment.apiBaseUrl}/subscriptions/unassign`,
      { email: userEmail },
      { headers: this.getHeaders() }
    ));
  }

  bitbucketLogin(code: string) {
    return this.http.post<{
      gitHubToken: string;
      gitHubId: number;
      gitHubAvatarUrl: string;
      gitHubProfileUrl: string;
      user: UserVm;
    }>(`${environment.apiBaseUrl}/auth/bitbucket/login`, { code });
  }

  gitHubLogin(code: string) {
    return this.http.post<{
      gitHubToken: string;
      gitHubId: number;
      gitHubAvatarUrl: string;
      gitHubProfileUrl: string;
      user: UserVm;
    }>(`${environment.apiBaseUrl}/auth/github/login`, { code });
  }

  gitLabLogin(code: string) {
    return this.http.post<{
      gitLabAccessToken: string;
      gitLabAccessTokenExpires: number;
      gitLabRefreshToken: string;
      gitLabId: number;
      gitLabAvatarUrl: string;
      gitLabProfileUrl: string;
      user: UserVm;
    }>(`${environment.apiBaseUrl}/auth/gitlab/login`, { code });
  }

  googleLogin(code: string) {
    return this.http.post<{ user: UserVm; }>(`${environment.apiBaseUrl}/auth/google/login`, { code });
  }

  getReferralAccount() {
    return this.withRetries(() => this.http.get<GetReferralAccountResponse>(
      `${environment.apiBaseUrl}/referrals`,
      { headers: this.getHeaders() }
    ));
  }

  manageReferralAccount() {
    return this.withRetries(() => this.http.post<{ accountId: string; url: string; }>(
      `${environment.apiBaseUrl}/referrals/manage`,
      null,
      { headers: this.getHeaders() }
    ));
  }

  createReferralAccount() {
    return this.withRetries(() => this.http.post<{ accountId: string; refersVia: string; url: string; }>(
      `${environment.apiBaseUrl}/referrals/create`,
      null,
      { headers: this.getHeaders() }
    ));
  }

  private withRetries = <T>(method: () => Observable<T>) => {
    const retry = (retries: number): Observable<T> => method().pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && retries > 0)
          return this.store.dispatch(new RefreshAccessToken()).pipe(switchMap(() => retry(retries - 1)));

        return throwError(() => error);
      })
    );

    return retry(ApiService.retries);
  };

  private getHeaders() {
    const user = this.store.selectSnapshot(AuthState.user);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return user ? { Authorization: `Bearer ${user.accessToken}` } : undefined;
  }
}
