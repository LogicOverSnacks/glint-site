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

      li {
        line-height: 25px;
      }

      .banner {
        height: 20px;
        display: inline-block;
        vertical-align: text-top;
      }

      a {
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
      }
    `
  ],
  template: `
  <app-container>
    <h1 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">Contact</h1>

    <h2>Sales Enquiries</h2>
    <ul>
      <li>
    Email: <a href="mailto:sales@glint.info">sales@glint.info</a>
      </li>
    </ul>

    <h2>Legal Questions</h2>
    <ul>
      <li>
        Email: <a href="mailto:legal@glint.info">legal@glint.info</a>
      </li>
    </ul>

    <h2>General Help</h2>
    <ul>
      <li>
        Gitter: <a class="banner" target="_blank" href="https://gitter.im/git-glint/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img src="https://badges.gitter.im/git-glint/community.svg"></a>
      </li>
      <li>
        Email: <a href="mailto:help@glint.info">help@glint.info</a>
      </li>
    </ul>
  </app-container>
  `
})
export class ContactComponent {

}
