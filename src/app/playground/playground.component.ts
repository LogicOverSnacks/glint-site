import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./playground.component.scss'],
  templateUrl: './playground.component.html'
})
export class PlaygroundComponent {
  loaded = new BehaviorSubject(false);
}
