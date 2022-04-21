import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `.title { margin-bottom: 50px; }`
  ],
  template: `
    <header class="mat-display-3 title">404 Page Not Found</header>
    <h3>Sorry! The page you are looking for does not exist.</h3>
  `
})
export class PageNotFoundComponent {

}
