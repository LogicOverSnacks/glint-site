import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./refund-policy.component.scss'],
  templateUrl: './refund-policy.component.html'
})
export class RefundPolicyComponent {}
