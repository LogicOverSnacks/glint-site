import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,

    ContainerComponent
  ],
  styleUrls: ['./eula.component.scss'],
  templateUrl: './eula.component.html'
})
export class EulaComponent {}
