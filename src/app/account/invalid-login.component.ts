import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ContainerComponent } from '../shared/container.component';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,

    ContainerComponent
  ],
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
      <header class="mat-headline-3 title" i18n>Invalid Login</header>

      <h3>
        <mat-icon color="warn" class="error-icon">warning</mat-icon><br>
        <ng-container *ngIf="errorType === 'bitbucket'" i18n>There was a problem authenticating with Bitbucket.</ng-container>
        <ng-container *ngIf="errorType === 'github'" i18n>There was a problem authenticating with GitHub.</ng-container>
        <ng-container *ngIf="errorType === 'gitlab'" i18n>There was a problem authenticating with GitLab.</ng-container>
        <ng-container *ngIf="errorType === 'google'" i18n>There was a problem authenticating with Google.</ng-container>
        <br>
        <ng-container i18n>
          Please click <a routerLink="/account/login">here</a> to try again.
        </ng-container>
      </h3>
    </app-container>
  `
})
export class InvalidLoginComponent {
  errorType: 'bitbucket' | 'github' | 'gitlab' | 'google' | null;

  constructor(route: ActivatedRoute) {
    switch (route.snapshot.params.type) {
      case 'bitbucket':
      case 'github':
      case 'gitlab':
      case 'google':
        this.errorType = route.snapshot.params.type;
        break;
      default:
        this.errorType = null;
        break;
    }
  }
}
