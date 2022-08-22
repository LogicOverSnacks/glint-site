import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
        There was a problem authenticating {{message}}.<br>
        Please click <a routerLink="/account/login">here</a> to try again.
      </h3>
    </app-container>
  `
})
export class InvalidLoginComponent {
  message: string;

  constructor(route: ActivatedRoute) {
    switch (route.snapshot.params.type) {
      case 'google':
        this.message = 'with Google';
        break;
      case 'github':
        this.message = 'with GitHub';
        break;
      case 'gitlab':
        this.message = 'with GitLab';
        break;
      case 'bitbucket':
        this.message = 'with Bitbucket';
        break;
      default:
        this.message = '';
        break;
    }
  }
}
