import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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

    a { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }
  `],
  template: `
    <header class="mat-headline-3 title">Payment Succeeded!</header>
    <h3>
      Thank you for your purchase, your subscription is now active!<br>
      You will need to logout of Glint and back in again to start enjoying the premium benefits.
    </h3>
  `
})
export class PaymentSuccessComponent {}
