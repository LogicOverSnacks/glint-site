import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `.title { margin-bottom: 50px; }`,
    `
      @use '@angular/material' as mat;
      @use 'src/theme' as theme;
      .link { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }
    `
  ],
  template: `
    <header class="mat-display-2 title">Login</header>
    <a [routerLink]="['/account/email/login']"><button type="button" mat-button>Login via Email</button></a>
    <a [routerLink]="['/account/github/login']"><button type="button" mat-button>Login via GitHub</button></a>
    <a [routerLink]="['/account/google/login']"><button type="button" mat-button>Login via Google</button></a>

    <p>Don't have an account? Click <a [routerLink]="['/account/email/register']" class="link">here</a> to register.</p>
  `
})
export class LoginComponent {}
