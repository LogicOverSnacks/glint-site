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

      .discord-btn {
        // text-align: center;
        margin-bottom: 40px;

        > a {
          font-size: 24px;
          line-height: 40px;
          padding-top: 5px;
          padding-bottom: 5px;

          img {
            margin-right: 5px;
            height: 40px;
            vertical-align: top;
          }

          .white {
            color: #fff;
            margin: 0 10px;
          }
        }
      }

      h3 {
        margin-bottom: 0;
      }

      a {
        color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
      }
    `
  ],
  template: `
  <app-container>
    <h1 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">Contact</h1>

    <div class="discord-btn">
      <a target="_blank" href="https://discord.gg/wXv8WUeFYZ" mat-stroked-button>
        <img src="assets/discord.svg"> <span class="white">|</span> Join
      </a>
    </div>

    <h2>Alternatively:</h2>

    <h3>General Help: <a href="mailto:help@glint.info">help@glint.info</a></h3>
    <h3>Legal Questions: <a href="mailto:legal@glint.info">legal@glint.info</a></h3>
    <h3>Sales Enquiries: <a href="mailto:sales@glint.info">sales@glint.info</a></h3>
  </app-container>
  `
})
export class ContactComponent {

}
