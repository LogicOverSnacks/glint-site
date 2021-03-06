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
      a { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }
    `
  ],
  template: `
    <header class="mat-display-2 title">403 Unauthorized</header>
    <h3>Sorry! You are not authorized to view this page. Click <a [routerLink]="['/account/login']">here</a> to login.</h3>
  `
})
export class UnauthorizedComponent {}
