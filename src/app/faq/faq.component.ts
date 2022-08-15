import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
    }`,
    `
      @use '@angular/material' as mat;
      @use 'src/theme' as theme;

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
    `
  ],
  template: `
    <app-container>
      <div class="faq-panel" ngClass.lt-sm="small">
        <h2 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">FAQ</h2>

        <h3>Is Glint free to use for commercial projects?</h3>
        <p>
          Yes! You only need to pay for the listed premium features.
        </p>

        <h3>What operating systems does Glint work on?</h3>
        <p>
          Windows, macOS, and Linux. Only x64 systems and Apple M1 (arm64) are supported.
          The application is designed for use on desktop computers,
          and so there is no version available for mobile devices or web browsers.
          The <a routerLink="/playground" class="link">playground</a> is a partially working online version that you can try without
          downloading the app.
        </p>

        <h3>Can I use Glint on multiple computers?</h3>
        <p>Yes, licenses are per user so you can use a single subscription on multiple devices, just log in with the same account.</p>

        <h3>Do I need to install any dependencies?</h3>
        <h4>Windows</h4>
        <p>The VC++ runtime is required, but this is included in the installer package and should be installed automatically.</p>

        <h4>Mac</h4>
        <p>No dependencies are required.</p>

        <h4>Linux</h4>
        <p>If using the AppImage, then fuse2 is required. If not already installed on your distribution, e.g. Ubuntu 22.04, you will need to run <strong>apt install libfuse2</strong>.</p>

        <h3>Can I purchase subscriptions for team members?</h3>
        <p>Yes, you can purchase multiple subscriptions and assign them to other users on the <a routerLink="/account" class="link">account</a> page. You don't need to have your own subscription to do this.</p>

        <h3>What is your refund policy?</h3>
        <p>All payments are non-refundable, but you can cancel your subscription at any time. Upon cancellation, you will still receive the premium benefits until the end of your billing period.</p>
      </div>

      <div class="enquire-panel">
        <h2 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">Further Questions?</h2>
        <a routerLink="/contact" class="link">Click here to enquire</a>
      </div>
    </app-container>
  `
})
export class FaqComponent {

}
