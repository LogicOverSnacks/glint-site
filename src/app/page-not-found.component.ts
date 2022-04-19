import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  template: `
    <h1>404 Page Not Found</h1>
    <p>Sorry the page you are looking for does not exist.</p>
  `
})
export class PageNotFoundComponent {

}
