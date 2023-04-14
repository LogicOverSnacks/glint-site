import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  standalone: true,
  styles: [`
    :host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }
  `],
  template: `
    <header class="mat-headline-3 title" i18n>404 Page Not Found</header>
    <h3 i18n>Sorry! The page you are looking for does not exist.</h3>
  `
})
export class PageNotFoundComponent {}
