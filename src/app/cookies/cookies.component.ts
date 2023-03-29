import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContainerComponent
  ],
  standalone: true,
  styleUrls: ['./cookies.component.scss'],
  templateUrl: './cookies.component.html'
})
export class CookiesComponent {}
