import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';

import { ApiService } from 'src/app/shared/api.service';
import { AuthState, UpdateGithubState, UpdateUser } from 'src/app/state/auth.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `
      @use '@angular/material' as mat;
      @use 'src/theme' as theme;

      .title { margin-bottom: 50px; }

      .link {
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
        cursor: pointer;
      }

      .error-icon, .success-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    `
  ],
  template: `
    <app-container>
      <header class="mat-display-2 title">Login with GitHub</header>

      <ng-container [ngSwitch]="view | async">
        <h3 *ngSwitchCase="'init'">Loading...</h3>

        <h3 *ngSwitchCase="'success'">
          <mat-icon color="primary" class="success-icon">done</mat-icon><br>
          Logged in successfully!<br>
          You should now be logged in and redirected back to Glint. If Glint is not logged in, please ensure that your browser is not blocking the popup.<br>
          You can now close this window.<br>
        </h3>

        <h3 *ngSwitchCase="'error'">
          <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
          {{error | async}}<br>
          Please click <a class="link" routerLink="/account/login">here</a> to try again.<br>
          If the problem persists please <a routerLink="/contact">contact us</a>.
        </h3>
      </ng-container>
    </app-container>
  `
})
export class GithubLoginComponent implements OnInit {
  view = new BehaviorSubject<'init' | 'success' | 'error'>('init');
  error = new BehaviorSubject('Sorry! Something went wrong.');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private api: ApiService
  ) {}

  ngOnInit() {
    const fromGlint = this.route.snapshot.queryParams.glint === 'true';
    const code = this.route.snapshot.queryParams.code;

    if (code) {
      const actualState = this.route.snapshot.queryParams.state;
      const expectedState = this.store.selectSnapshot(AuthState.githubState);

      if (actualState !== expectedState) {
        this.router.navigate(['/account/github/invalid']);
        return;
      }

      this.api.githubLogin(code)
        .pipe(
          catchError((response: HttpErrorResponse) => {
            if (response.status === 403)
              this.error.next(response.error.message);
            else
              this.error.next('Sorry! Something went wrong.');

            this.view.next('error');
            return EMPTY;
          })
        )
        .subscribe(({ githubToken, user }) => {
          if (fromGlint) {
            /* eslint-disable @typescript-eslint/naming-convention */
            const queryParams = {
              github_token: githubToken,
              email: user.email,
              created_at: user.createdAt,
              confirmed: user.confirmed,
              access_token: user.accessToken,
              refresh_token: user.refreshToken,
              expires: user.expires
            };
            /* eslint-enable @typescript-eslint/naming-convention */
            this.view.next('success');
            window.open(`git-glint://oauth/github?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`);
          } else {
            this.store.dispatch(new UpdateUser(user)).subscribe(() => {
              this.router.navigate(['/account']);
            });
          }
        });
    } else {
      const baseUrl = 'https://github.com/login/oauth/authorize';
      /* eslint-disable @typescript-eslint/naming-convention */
      const queryParams = {
        client_id: '57f2729610ec48a1d787',
        redirect_uri: encodeURIComponent(`${location.origin}/account/github/login?glint=${fromGlint}`),
        scope: encodeURIComponent('repo user:email'),
        state: [...Array(30)].map(() => Math.random().toString(36)[2] || '0').join('')
      };
      /* eslint-enable @typescript-eslint/naming-convention */

      this.store.dispatch(new UpdateGithubState(queryParams.state)).subscribe(() => {
        window.open(`${baseUrl}?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`, '_self');
      });
    }
  }
}
