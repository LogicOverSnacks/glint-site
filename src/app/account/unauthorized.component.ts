import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule
  ],
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }

    a { color: mat.m2-get-color-from-palette(theme.$app-primary-palette, 300); }
  `],
  template: `
    <header class="mat-headline-3 title" i18n>403 Unauthorized</header>
    <h3 i18n>Sorry! You are not authorized to view this page. Click <a routerLink="/account/login">here</a> to login.</h3>
  `
})
export class UnauthorizedComponent {}
