import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { takeUntil } from 'rxjs';

import { BaseComponent } from './base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-container',
  styles: [
    `:host {
      display: block;
      height: 100%;
    }`
  ],
  template: `<ng-content></ng-content>`
})
export class ContainerComponent extends BaseComponent {
  @HostBinding('style.margin')
  hostMargin = '0 16px';

  @HostBinding('style.width')
  hostWidth = 'auto';

  constructor(
    cdr: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver
  ) {
    super();

    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(state => {
        this.hostMargin = '0 16px';
        this.hostWidth = 'auto';

        const matched = Object.entries(state.breakpoints).find(([, matches]) => matches);
        if (matched) {
          switch (matched[0]) {
            case Breakpoints.XSmall:
              this.hostMargin = '0 16px';
              this.hostWidth = 'auto';
              break;
            case Breakpoints.Small:
              this.hostMargin = '0 32px';
              this.hostWidth = 'auto';
              break;
            case Breakpoints.Medium:
              this.hostMargin = '0 auto';
              this.hostWidth = '895px';
              break;
            case Breakpoints.Large:
              this.hostMargin = '0 192px';
              this.hostWidth = 'auto';
              break;
            case Breakpoints.XLarge:
              this.hostMargin = '0 auto';
              this.hostWidth = '1536px';
              break;
          }
        }

        cdr.markForCheck();
      });
  }
}
