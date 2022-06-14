import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./eula.component.scss'],
  templateUrl: './eula.component.html'
})
export class EulaComponent {}
