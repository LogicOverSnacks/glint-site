import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,

    ContainerComponent
  ],
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
    }

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
      margin-bottom: 40px;

      > a {
        font-size: 24px;
        line-height: 40px;
        height: 50px;
        padding-top: 5px;
        padding-bottom: 5px;
        color: mat.m2-get-color-from-palette(theme.$app-primary-palette, 300);

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
      color: mat.m2-get-color-from-palette(theme.$app-primary-palette, 300);
    }
  `],
  template: `
    <app-container>
      <h1 class="title" [ngClass]="(isXs | async) ? 'mat-headline-4' : 'mat-headline-3'" i18n>Contact</h1>

      <div class="discord-btn">
        <a target="_blank" href="https://discord.gg/wXv8WUeFYZ" mat-stroked-button>
          <img src="assets/discord.svg" alt="Join Discord" i18n-alt> <span class="white">|</span> <ng-container i18n>Join</ng-container>
        </a>
      </div>

      <h2 i18n>Alternatively:</h2>

      <h3><ng-container i18n>General Help:</ng-container>&nbsp;<a href="mailto:help@glint.info">help&#64;glint.info</a></h3>
      <h3><ng-container i18n>Legal Questions:</ng-container>&nbsp;<a href="mailto:legal@glint.info">legal&#64;glint.info</a></h3>
      <h3><ng-container i18n>Sales Enquiries:</ng-container>&nbsp;<a href="mailto:sales@glint.info">sales&#64;glint.info</a></h3>
    </app-container>
  `
})
export class ContactComponent {
  isXs = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(({ matches }) => matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
