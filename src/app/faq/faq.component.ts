import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,

    ContainerComponent
  ],
  standalone: true,
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
    }

    .link { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }

    .faq-panel {
      .title {
        margin-bottom: 40px;
        text-align: center;
      }

      h3 {
        font-size: 28px;
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
        margin-top: 40px;
      }

      h4 {
        font-size: 18px;
        color: mat.get-color-from-palette(theme.$app-primary-palette, 200);
        margin-top: 15px;
        margin-bottom: 10px;
      }

      &.small h3 {
        font-size: 22px;
      }
    }

    .enquire-panel {
      margin-top: 60px;
      text-align: center;

      .title {
        margin-bottom: 40px;
      }
    }
  `],
  template: `
    <app-container>
      <div class="faq-panel" [class.small]="isXs | async">
        <h2 class="title" [ngClass]="(isXs | async) ? 'mat-headline-4' : 'mat-headline-3'" i18n>FAQ</h2>

        <h3 i18n>Is Glint free to use for commercial projects?</h3>
        <p i18n>
          Yes, you only need to pay if you want the premium <a routerLink="/features" class="link">features</a>.
        </p>

        <h3 i18n>What operating systems does Glint work on?</h3>
        <p i18n>
          Windows, macOS, and Linux. Only x64 systems and Apple M1 (arm64) are supported.
          The application is designed for use on desktop computers,
          and so there is no version available for mobile devices or web browsers.
          The <a routerLink="/playground" class="link">playground</a> is a partially working online version that you can try without
          downloading the app.
        </p>

        <h3 i18n>Can I use Glint on multiple computers?</h3>
        <p i18n>Yes, licenses are per user so you can use a single subscription on multiple devices, just log in with the same account.</p>

        <h3 i18n>Do I need to install any dependencies?</h3>
        <p i18n>In most cases no, but check the <a routerLink="/docs/installation" class="link">installation docs</a> for details.</p>

        <h3 i18n>Can I purchase subscriptions for team members?</h3>
        <p i18n>Yes, you can purchase multiple subscriptions and assign them to other users on the <a routerLink="/account" class="link">account</a> page. You don't need to have your own subscription to do this.</p>

        <h3 i18n>What is your refund policy?</h3>
        <p i18n>All payments are non-refundable, but you can cancel your subscription at any time. Upon cancellation, you will still receive the premium benefits until the end of your billing period.</p>
      </div>

      <div class="enquire-panel">
        <h2 class="title" [ngClass]="(isXs | async) ? 'mat-headline-4' : 'mat-headline-3'" i18n>Further Questions?</h2>
        <a routerLink="/contact" class="link" i18n>Click here to enquire</a>
      </div>
    </app-container>
  `
})
export class FaqComponent {
  isXs = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(({ matches }) => matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
