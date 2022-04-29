import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
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
    media: MediaObserver
  ) {
    super();

    media.asObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(changes => {
        this.hostMargin = '0 16px';
        this.hostWidth = 'auto';

        for (const change of changes.reverse()) {
          if (change.matches) {
            switch (change.mqAlias) {
              case 'lt-sm':
              case 'xs':
                this.hostMargin = '0 16px';
                this.hostWidth = 'auto';
                break;
              case 'gt-xs':
              case 'lt-md':
              case 'sm':
                this.hostMargin = '0 32px';
                this.hostWidth = 'auto';
                break;
              case 'gt-sm':
              case 'lt-lg':
              case 'md':
                this.hostMargin = '0 auto';
                this.hostWidth = '895px';
                break;
              case 'gt-md':
              case 'lt-xl':
              case 'lg':
                this.hostMargin = '0 192px';
                this.hostWidth = 'auto';
                break;
              case 'gt-lg':
              case 'xl':
                this.hostMargin = '0 auto';
                this.hostWidth = '1536px';
                break;
            }
          }
        }

        cdr.markForCheck();
      });
  }
}
