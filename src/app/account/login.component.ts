import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }

    .link { color: mat.m2-get-color-from-palette(theme.$app-primary-palette, 300); }

    .login-methods {
      margin: 40px auto;
      width: 185px;

      a {
        margin-bottom: 10px;
        justify-content: flex-start;
        width: 100%;

        svg {
          vertical-align: top;
          height: 1.125rem;
          width: 1.125rem;
          margin-left: -4px;
          margin-right: 8px;
        }
      }
    }
  `],
  template: `
    <header class="mat-headline-3 title" i18n>Login</header>
    <div class="login-methods">
      <a routerLink="/account/email/login" mat-stroked-button>
        <mat-icon>mail</mat-icon>
        <ng-container i18n>with Email</ng-container>
      </a>
      <a routerLink="/account/login/github" mat-stroked-button>
        <svg version="1.1" width="22" height="22" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <span i18n>with GitHub</span>
      </a>
      <a routerLink="/account/login/gitlab" mat-stroked-button>
        <svg version="1.1" width="22" height="22" aria-hidden="true" viewBox="0 0 380 380" fill="currentColor">
          <g transform="scale(1.97) translate(-93, -90)"><path d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"></path></g>
        </svg>
        <span i18n>with GitLab</span>
      </a>
      <a routerLink="/account/login/bitbucket" mat-stroked-button>
        <svg version="1.1" width="22" height="22" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
          <g transform="scale(1.2, 1.2) translate(-3, -3)"><path d="M26.9496 12.2332H19.7564L18.5575 19.3066H13.5622L7.68774 26.3C7.68774 26.3 7.96746 26.5398 8.36709 26.5398H24.0324C24.3921 26.5398 24.7118 26.2601 24.7917 25.9004L26.9496 12.2332Z" fill="url(#paint0_linear)"/><path d="M4.77041 5C4.29085 5 3.93123 5.43959 4.01115 5.87918L7.24813 25.7007C7.28809 25.9405 7.40799 26.1803 7.60781 26.3401C7.60781 26.3401 7.88753 26.5799 8.28716 26.5799L14.3615 19.3067H13.5223L12.2035 12.2333H19.7565H26.9498L27.9888 5.87918C28.0688 5.39963 27.7091 5 27.2295 5H4.77041Z" fill="currentColor"/><defs><linearGradient id="paint0_linear" x1="27.8984" y1="15.3873" x2="16.6183" y2="23.0226" gradientUnits="userSpaceOnUse"><stop offset="0.0718327" stop-color="currentColor" stop-opacity="0.4"/><stop offset="1" stop-color="currentColor"/></linearGradient></defs></g>
        </svg>

        <span i18n>with Bitbucket</span>
      </a>
      <a routerLink="/account/login/google" mat-stroked-button>
        <svg version="1.1" width="22" height="22" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
          <defs>
            <path id="A" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
          </defs>
          <clipPath id="B"><use xlink:href="#A"/></clipPath>
          <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
            <path d="M0 37V11l17 13z" clip-path="url(#B)" />
            <path d="M0 11l17 13 7-6.1L48 14V0H0z" clip-path="url(#B)" />
            <path d="M0 37l30-23 7.9 1L48 0v48H0z" clip-path="url(#B)" />
            <path d="M48 48L17 24l-4-3 35-10z" clip-path="url(#B)" />
          </g>
        </svg>
        <!-- Google logo with colors:
        <svg version="1.1" width="24" height="24" aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
          <defs>
            <path id="A" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
          </defs>
          <clipPath id="B"><use xlink:href="#A"/></clipPath>
          <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
            <path d="M0 37V11l17 13z" clip-path="url(#B)" fill="#fbbc05"/><path d="M0 11l17 13 7-6.1L48 14V0H0z" clip-path="url(#B)" fill="#ea4335"/>
            <path d="M0 37l30-23 7.9 1L48 0v48H0z" clip-path="url(#B)" fill="#34a853"/>
            <path d="M48 48L17 24l-4-3 35-10z" clip-path="url(#B)" fill="#4285f4"/>
          </g>
        </svg> -->
        <span i18n>with Google</span>
      </a>
    </div>

    <p i18n>Don't have an account? Click <a routerLink="/account/email/register" class="link">here</a> to register.</p>
  `
})
export class LoginComponent {}
