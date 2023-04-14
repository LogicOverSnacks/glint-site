import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,

    ContainerComponent
  ],
  standalone: true,
  styleUrls: ['./terms.component.scss'],
  templateUrl: './terms.component.html'
})
export class TermsComponent {}
