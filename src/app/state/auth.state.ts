import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserVm } from './user.vm';

export class ConsentToCookies {
  static readonly type = '[Auth] ConsentToCookies';
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class RefreshAccessToken {
  static readonly type = '[Auth] RefreshAccessToken';
}

export class UpdateUser {
  static readonly type = '[Auth] UpdateUser';
  constructor(public user: UserVm | null) {}
}

export interface IAuthStateModel {
  cookieConsent: boolean;
  user: UserVm | null;
}

/* eslint-disable @typescript-eslint/member-ordering */
@State<IAuthStateModel>({
  name: 'auth',
  defaults: {
    cookieConsent: false,
    user: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static cookieConsent(state: IAuthStateModel) {
    return state.cookieConsent;
  }

  @Selector()
  static user(state: IAuthStateModel) {
    return state.user;
  }

  @Action(ConsentToCookies)
  consentToCookies(ctx: StateContext<IAuthStateModel>, action: ConsentToCookies) {
    ctx.setState(state => ({
      ...state,
      cookieConsent: true
    }));
  }

  @Action(Logout)
  logout(ctx: StateContext<IAuthStateModel>, action: Logout) {
    ctx.setState(state => ({
      ...state,
      user: null
    }));
  }

  @Action(RefreshAccessToken)
  refreshAccessToken(ctx: StateContext<IAuthStateModel>, action: RefreshAccessToken) {
    const user = ctx.getState().user;
    if (!user) {
      this.router.navigate(['/account/login']);
      throw new Error(`Cannot refresh access token as no user is currently logged in.`);
    }

    return this.http
      .post<{ accessToken: string; expires: string; confirmed: boolean; }>(
        `${environment.apiBaseUrl}/auth/email/refresh-token`,
        { refreshToken: user.refreshToken }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          ctx.setState(state => ({
            ...state,
            user: null
          }));

          if (error.status === 401)
            this.router.navigate(['/account/login']);

          return throwError(() => error);
        }),
        tap(({ accessToken, expires, confirmed }) => {
          ctx.setState(state => ({
            ...state,
            user: state.user
              ? {
                ...state.user,
                accessToken,
                expires,
                confirmed
              }
              : null
          }));
        })
      );
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<IAuthStateModel>, action: UpdateUser) {
    ctx.setState(state => ({
      ...state,
      user: action.user
    }));
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
}
