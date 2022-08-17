import { ChangeDetectionStrategy, Component } from '@angular/core';

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

      .link { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }

      .login-methods {
        display: inline-block;
        margin-bottom: 40px;

        a {
          display: block;
          margin-bottom: 10px;

          mat-icon {
            margin-left: -11px;
          }

          mat-icon, svg {
            margin-right: 10px;
          }

          span {
            font-size: 14px;
          }
        }
      }
    `
  ],
  template: `
    <header class="mat-display-2 title">Login</header>
    <div class="login-methods">
      <a [routerLink]="['/account/email/login']" mat-stroked-button>
        <mat-icon>mail</mat-icon> <span>with Email</span>
      </a>
      <a [routerLink]="['/account/github/login']" mat-stroked-button>
        <svg version="1.1" width="22" height="22" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <span>with GitHub</span>
      </a>
      <a [routerLink]="['/account/google/login']" mat-stroked-button disabled matTooltip="Not available yet">
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
        <span>with Google</span>
      </a>
    </div>

    <p>Don't have an account? Click <a [routerLink]="['/account/email/register']" class="link">here</a> to register.</p>
  `
})
export class LoginComponent {}
