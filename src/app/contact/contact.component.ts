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

      .title {
        text-align: center;
        margin-bottom: 40px;
      }

      h2 {
        margin-top: 20px;
      }

      a {
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
      }
    `
  ],
  template: `
  <app-container>
    <h1 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">Contact Us</h1>

    <h2>Sales Enquiries</h2>
    Email: <a href="mailto:sales@glint.info">sales@glint.info</a>

    <h2>Legal Questions</h2>
    Email: <a href="mailto:legal@glint.info">legal@glint.info</a>

    <h2>General Help</h2>
    Email: <a href="mailto:help@glint.info">help@glint.info</a> for anything else.
  </app-container>
  `
})
export class ContactComponent {

}
