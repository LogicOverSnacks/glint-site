import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }

    a { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }
  `],
  template: `
    <header class="mat-headline-3 title">403 Unauthorized</header>
    <h3>Sorry! You are not authorized to view this page. Click <a routerLink="/account/login">here</a> to login.</h3>
  `
})
export class UnauthorizedComponent {}
