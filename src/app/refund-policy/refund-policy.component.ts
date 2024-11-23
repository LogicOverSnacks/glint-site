import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,

    ContainerComponent
  ],
  styleUrls: ['./refund-policy.component.scss'],
  templateUrl: './refund-policy.component.html'
})
export class RefundPolicyComponent {}
