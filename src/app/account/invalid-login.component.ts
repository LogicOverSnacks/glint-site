import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,

    ContainerComponent
  ],
  standalone: true,
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }

    a {
      color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `],
  template: `
    <app-container>
      <header class="mat-headline-3 title">Invalid Login</header>

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
