import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cookies.component.scss'],
  templateUrl: './cookies.component.html'
})
export class CookiesComponent {}
