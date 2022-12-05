import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatLegacyTooltip as MatTooltip } from '@angular/material/legacy-tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';

import { ApiService } from 'src/app/shared/api.service';
import { CryptoService } from 'src/app/shared/crypto.service';
import { UpdateUser } from 'src/app/state/auth.state';
import { environment } from 'src/environments/environment';

interface IState {
  glint: boolean;
  integration: boolean;
  random: string;
}

type ProviderType = 'bitbucket' | 'github' | 'gitlab' | 'google';

interface ProviderDetails {
  clientId: string;
  oauthUrl: string;
  redirectUri: string;
  storageKey: string;
  loginScopes: string;
  glintScopes: string;
  additional?: Record<string, string>;
}

@Component({
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s 2s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
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

      .authorization-code {
        margin-top: 40px;

        mat-form-field {
          display: block;
          margin: 20px auto 0 auto;
          max-width: 600px;

          mat-icon {
            cursor: pointer;
            margin-left: 10px;
          }
        }
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
      <header class="mat-display-2 title">Login with {{type}}</header>

      <ng-container [ngSwitch]="view | async">
        <h3 *ngSwitchCase="'init'">Loading...</h3>

        <ng-container *ngSwitchCase="'success'">
          <h3>
            <mat-icon color="primary" class="success-icon">done</mat-icon><br>
            Logged in successfully!<br>
            You should now be redirected back to Glint.<br>
          </h3>

          <div class="authorization-code" @fadeIn>
            If that didn't work, you can paste this authorization code into Glint directly:

            <mat-form-field appearance="outline">
              <mat-label>Authorization Code</mat-label>
              <input matInput readonly [value]="code">
              <mat-icon
                matSuffix
                (click)="copyCode(tooltip)"
                (mouseenter)="$event.stopImmediatePropagation()"
                matTooltip="Authorization Code Copied!"
                #tooltip="matTooltip"
              >content_copy</mat-icon>
            </mat-form-field>
          </div>
        </ng-container>

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
export class OAuthLoginComponent implements OnInit {
  private static readonly providers: Record<ProviderType, ProviderDetails> = {
    bitbucket: {
      clientId: environment.bitbucketClientId,
      oauthUrl: 'https://bitbucket.org/site/oauth2/authorize',
      redirectUri: `${location.origin}/account/login/bitbucket`,
      storageKey: 'bitbucketState',
      loginScopes: 'account email',
      glintScopes: 'account email pullrequest:write repository:admin repository:write'
    },
    github: {
      clientId: environment.githubClientId,
      oauthUrl: 'https://github.com/login/oauth/authorize',
      redirectUri: `${location.origin}/account/login/github`,
      storageKey: 'githubState',
      loginScopes: 'user:email',
      glintScopes: 'repo user:email'
    },
    gitlab: {
      clientId: environment.gitlabClientId,
      oauthUrl: 'https://gitlab.com/oauth/authorize',
      redirectUri: `${location.origin}/account/login/gitlab`,
      storageKey: 'gitlabState',
      loginScopes: 'email openid read_user',
      glintScopes: 'api email openid read_user write_repository'
    },
    google: {
      clientId: environment.googleClientId,
      oauthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      redirectUri: `${location.origin}/account/login/google`,
      storageKey: 'googleState',
      loginScopes: 'openid email',
      glintScopes: 'openid email',
      additional: {
        prompt: 'consent select_account'
      }
    }
  };

  type!: string;
  code?: string;
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
    const type = this.route.snapshot.params.type as ProviderType;
    this.code = this.route.snapshot.queryParams.code;
    const error = this.route.snapshot.queryParams.error;

    if (!['bitbucket', 'github', 'gitlab', 'google'].includes(type)) {
      this.type = type;
      this.error.next(`Invalid url segment: ${type}`);
      this.view.next('error');
      return;
    }

    this.type = type === 'bitbucket' ? 'Bitbucket'
      : type === 'github' ? 'GitHub'
      : type === 'gitlab' ? 'GitLab'
      : type === 'google' ? 'Google'
      : type;

    const provider = OAuthLoginComponent.providers[type];

    if (error) {
      this.error.next(decodeURIComponent(error));
      this.view.next('error');
      return;
    }

    const code = this.code;
    if (code) {
      const actualStateHash = decodeURIComponent(this.route.snapshot.queryParams.state);
      const expectedState = sessionStorage.getItem(provider.storageKey);

      this.cryptoService.digest(expectedState ?? undefined).then(expectedStateHash => {
        if (!expectedState || actualStateHash !== expectedStateHash) {
          this.router.navigate([`/account/invalid/${type}`]);
          return;
        }

        const state = JSON.parse(expectedState) as IState;
        sessionStorage.removeItem(provider.storageKey);

        if (state.integration) this.integrated(type, decodeURIComponent(code));
        else this.loggedIn(type, decodeURIComponent(code), state.glint);
      });
    } else {
      this.login(provider, !!this.route.snapshot.queryParams.glint, !!this.route.snapshot.queryParams.integration);
    }
  }

  copyCode(tooltip: MatTooltip) {
    if (this.code)
      navigator.clipboard.writeText(this.code).then(() => tooltip.show());
  }

  private login(provider: ProviderDetails, glint: boolean, integration: boolean) {
    const state = {
      glint: glint,
      integration: integration,
      random: this.cryptoService.generateUUID()
    } as IState;
    const stateString = JSON.stringify(state);
    this.cryptoService.digest(stateString).then(stateHash => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const queryParams = {
        client_id: provider.clientId,
        redirect_uri: provider.redirectUri,
        response_type: 'code',
        scope: glint ? provider.glintScopes : provider.loginScopes,
        state: stateHash,
        ...provider.additional
      };
      /* eslint-enable @typescript-eslint/naming-convention */

      sessionStorage.setItem(provider.storageKey, stateString);
      window.open(`${provider.oauthUrl}?${this.toQueryParamsString(queryParams)}`, '_self');
    });
  }

  private loggedIn(type: ProviderType, code: string, glint: boolean) {
    if (glint) {
      window.open(`git-glint://oauth/${type}?${this.toQueryParamsString({ code })}`, '_self');
      this.view.next('success');
    } else {
      const login = type === 'bitbucket' ? this.api.bitbucketLogin(code)
        : type === 'github' ? this.api.gitHubLogin(code)
        : type === 'gitlab' ? this.api.gitLabLogin(code)
        : type === 'google' ? this.api.googleLogin(code)
        : null;

      if (!login) {
        this.error.next(`Invalid url segment: ${type}`);
        this.view.next('error');
        throw new Error(`Invalid url segment: ${type}`);
      }

      login
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

  private integrated(type: ProviderType, code: string) {
    window.open(`git-glint://integration/${type}?${this.toQueryParamsString({ code })}`, '_self');
    this.view.next('success');
  }

  private toQueryParamsString = (queryParams: Record<string, any>) =>
    Object.entries(queryParams).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
}
