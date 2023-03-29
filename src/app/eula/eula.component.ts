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
  styleUrls: ['./eula.component.scss'],
  templateUrl: './eula.component.html'
})
export class EulaComponent {}
