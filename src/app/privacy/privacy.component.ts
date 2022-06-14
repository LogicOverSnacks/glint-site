import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./privacy.component.scss'],
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent {}
