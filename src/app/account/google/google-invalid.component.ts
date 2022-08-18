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

      a {
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
      }

      .error-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    `
  ],
  template: `
    <app-container>
      <header class="mat-display-2 title">Invalid Login</header>

      <h3>
        <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
        There was a problem authenticating with Google.<br>
        Please click <a routerLink="/account/login">here</a> to try again.
      </h3>
    </app-container>
  `
})
export class GoogleInvalidComponent {}
