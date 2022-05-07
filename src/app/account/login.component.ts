import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `.title { margin-bottom: 50px; }`
  ],
  template: `
    <header class="mat-display-2 title">Login</header>
    <a [routerLink]="['/account/email/login']"><button type="button" mat-button>Login via Email</button></a>
    <a [routerLink]="['/account/github/login']"><button type="button" mat-button>Login via GitHub</button></a>
    <a [routerLink]="['/account/google/login']"><button type="button" mat-button>Login via Google</button></a>

    <p>Don't have an account? Click <a [routerLink]="['/account/email/register']">here</a> to register.</p>
  `
})
export class LoginComponent {}
