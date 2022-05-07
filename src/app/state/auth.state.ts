import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import { ApiBaseUrl } from '../shared';
import { UserVm } from './user.vm';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public email: string, public password: string) {}
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
  user: UserVm | null;
}

/* eslint-disable @typescript-eslint/member-ordering */
@State<IAuthStateModel>({
  name: 'auth',
  defaults: {
    user: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static user(state: IAuthStateModel) {
    return state.user;
  }

  @Action(Login)
  login(ctx: StateContext<IAuthStateModel>, action: Login) {
    return this.http
      .post<{ user: UserVm; }>(`${ApiBaseUrl}/auth/email/login`, {
        email: action.email,
        password: action.password
      })
      .pipe(
        tap(({ user }) => {
          ctx.setState(state => ({
            ...state,
            user
          }));
        })
      );
  }

  @Action(Logout)
  logout(ctx: StateContext<IAuthStateModel>, action: Logout) {
    ctx.setState(state => ({
      ...state,
      user: null
    }))
  }

  @Action(RefreshAccessToken)
  refreshAccessToken(ctx: StateContext<IAuthStateModel>, action: RefreshAccessToken) {
    const user = ctx.getState().user;
    if (!user) throw new Error(`Cannot refresh access token as no user is currently logged in.`);

    return this.http
      .post<{ accessToken: string; expires: string; }>(`${ApiBaseUrl}/auth/email/refresh-token`, {
        refreshToken: user.refreshToken
      })
      .pipe(
        tap(({ accessToken, expires }) => {
          ctx.setState(state => ({
            ...state,
            user: state.user
              ? {
                ...state.user,
                accessToken: accessToken,
                expires: expires
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

  constructor(private http: HttpClient) {}
}
