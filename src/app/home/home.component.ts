import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, filter, map, Observable, shareReplay } from 'rxjs';

import { DownloadComponent } from '../download/download.component';
import { ContainerComponent } from '../shared/container.component';
import { ReleasesState } from '../state/releases.state';

@Component({
  animations: [
    trigger('fade', [
      state('none', style({
        height: 0,
        opacity: 0
      })),
      state('*', style({
        height: '*',
        opacity: 1
      })),
      transition('* <=> *', [
        animate('225ms ease-in-out')
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,

    ContainerComponent,
    DownloadComponent
  ],
  standalone: true,
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  release!: Observable<{ platform: 'Windows' | 'Mac' | 'Linux' | 'Other'; name: string; link: string; }>;
  currentFeature = new BehaviorSubject<'edit' | 'search' | 'merge' | 'move' | 'resolve' | 'none'>('none');
  lastFeature = this.currentFeature.pipe(
    filter(feature => feature !== 'none'),
    shareReplay(1)
  );

  isXs = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(({ matches }) => matches));
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store
  ) {}

  ngOnInit() {
    this.release = this.store.select(ReleasesState.releases).pipe(
      map(releases => releases.find(release => !release.prerelease) ?? releases[0]),
      map(release => {
        if (!release) {
          return {
            platform: 'Other',
            name: '',
            link: '/download'
          };
        }

        const platform = this.getPlatform();

        return {
          platform: platform,
          name: release.tag_name,
          link: platform === 'Windows' ? release.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url ?? '/download'
            : platform === 'Mac' ? release.assets.find(a => a.name.endsWith('.dmg'))?.browser_download_url ?? '/download'
            : platform === 'Linux' ? release.assets.find(a => a.name.endsWith('.AppImage'))?.browser_download_url ?? '/download'
            : '/download'
        };
      })
    );
  }

  private getPlatform() {
    let platform: string;
    if (navigator.userAgentData)
      platform = navigator.userAgentData.platform;
    else
      platform = navigator.platform;

    return /win/i.test(platform) ? 'Windows' as const
      : /mac/i.test(platform) ? 'Mac' as const
      : /linux/i.test(platform) ? 'Linux' as const
      : 'Other' as const;
  }
}
