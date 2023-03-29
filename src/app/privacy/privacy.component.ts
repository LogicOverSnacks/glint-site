import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,

    ContainerComponent
  ],
  standalone: true,
  styleUrls: ['./privacy.component.scss'],
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent {}
