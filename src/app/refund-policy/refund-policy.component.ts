import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContainerComponent
  ],
  standalone: true,
  styleUrls: ['./refund-policy.component.scss'],
  templateUrl: './refund-policy.component.html'
})
export class RefundPolicyComponent {}
