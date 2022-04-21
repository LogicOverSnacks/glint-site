import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-playground',
  styleUrls: ['./playground.component.scss'],
  templateUrl: './playground.component.html'
})
export class PlaygroundComponent {

}
