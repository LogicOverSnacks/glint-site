import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';

import { toQueryParamsString } from 'src/app/shared';
import { ApiService } from 'src/app/shared/api.service';
import { CryptoService } from 'src/app/shared/crypto.service';
import { UpdateUser } from 'src/app/state/auth.state';
import { environment } from 'src/environments/environment';

interface IState {
  glint: boolean;
  integration: boolean;
  random: string;
}

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
export class GitHubLoginComponent implements OnInit {
  private static readonly oauthUrl = 'https://github.com/login/oauth/authorize';
  private static readonly redirectUri = `${location.origin}/account/github/login`;
  private static readonly storageKey = 'gitHubState';

  view = new BehaviorSubject<'init' | 'success' | 'error'>('init');
  error = new BehaviorSubject('Sorry! Something went wrong.');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private api: ApiService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParams.code;
    const error = this.route.snapshot.queryParams.error;

    if (error) {
      this.error.next(decodeURIComponent(error));
      this.view.next('error');
      return;
    }

    if (code) {
      const actualStateHash = decodeURIComponent(this.route.snapshot.queryParams.state);
      const expectedState = sessionStorage.getItem(GitHubLoginComponent.storageKey);

      this.cryptoService.digest(expectedState ?? undefined).then(expectedStateHash => {
        if (!expectedState || actualStateHash !== expectedStateHash) {
          this.router.navigate(['/account/invalid/github']);
          return;
        }

        const state = JSON.parse(expectedState) as IState;
        sessionStorage.removeItem(GitHubLoginComponent.storageKey);

        if (state.integration) this.integrated(decodeURIComponent(code));
        else this.loggedIn(decodeURIComponent(code), state.glint);
      });
    } else {
      this.login(!!this.route.snapshot.queryParams.glint, !!this.route.snapshot.queryParams.integration);
    }
  }

  private login(glint: boolean, integration: boolean) {
    const state = {
      glint: glint,
      integration: integration,
      random: this.cryptoService.generateUUID()
    } as IState;
    const stateString = JSON.stringify(state);
    this.cryptoService.digest(stateString).then(stateHash => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const queryParams = {
        client_id: environment.githubClientId,
        redirect_uri: GitHubLoginComponent.redirectUri,
        scope: glint ? 'repo user:email' : 'user:email',
        state: stateHash
      };
      /* eslint-enable @typescript-eslint/naming-convention */

      sessionStorage.setItem(GitHubLoginComponent.storageKey, stateString);
      window.open(`${GitHubLoginComponent.oauthUrl}?${toQueryParamsString(queryParams)}`, '_self');
    });
  }

  private loggedIn(code: string, glint: boolean) {
    if (glint) {
      /* eslint-disable @typescript-eslint/naming-convention */
      const queryParams = {
        code: code,
        redirect_uri: GitHubLoginComponent.redirectUri
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      window.open(`git-glint://oauth/github?${toQueryParamsString(queryParams)}`, '_self');
      this.view.next('success');
    } else {
      this.api.gitHubLogin(code, GitHubLoginComponent.redirectUri)
        .pipe(
          catchError((response: HttpErrorResponse) => {
            if (response.status === 400 || response.status === 403)
              this.error.next(response.error.message);
            else
              this.error.next('Sorry! Something went wrong.');

            this.view.next('error');
            return EMPTY;
          })
        )
        .subscribe(({ user }) => {
          this.store.dispatch(new UpdateUser(user)).subscribe(() => {
            this.router.navigate(['/account']);
          });
        });
    }
  }

  private integrated(code: string) {
    window.open(`git-glint://integration/github?${toQueryParamsString({ code })}`, '_self');
    this.view.next('success');
  }
}
