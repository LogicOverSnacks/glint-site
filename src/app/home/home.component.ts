import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  template: `<app-playground></app-playground>`
})
export class HomeComponent {

}
