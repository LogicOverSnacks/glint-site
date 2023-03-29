import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, map } from 'rxjs';

import { ContainerComponent } from '../shared/container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,

    ContainerComponent
  ],
  standalone: true,
  styleUrls: ['./playground.component.scss'],
  templateUrl: './playground.component.html'
})
export class PlaygroundComponent {
  loaded = new BehaviorSubject(false);
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
