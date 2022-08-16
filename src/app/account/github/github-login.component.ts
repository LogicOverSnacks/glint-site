import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { ApiService } from 'src/app/shared/api.service';
import { AuthState, UpdateGithubState, UpdateUser } from 'src/app/state/auth.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`
  ],
  template: `<app-container>Loading...</app-container>`
})
export class GithubLoginComponent implements OnInit {
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

      this.api.githubLogin(code).subscribe(({ githubToken, user }) => {
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
          window.open(`git-glint://oauth/github?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`);
          // TODO: redirect to open glint page?
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
        redirect_uri: encodeURIComponent(`http://localhost:4200/account/github/login?glint=${fromGlint}`),
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
