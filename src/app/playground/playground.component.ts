import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./playground.component.scss'],
  templateUrl: './playground.component.html'
})
export class PlaygroundComponent {
  loaded = new BehaviorSubject(false);
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
