import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';
import { map, takeUntil } from 'rxjs';

import { BaseComponent } from '../shared';
import { ContainerComponent } from '../shared/container.component';
import { ReleasesState } from '../state/releases.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,

    ContainerComponent
  ],
  selector: 'app-download',
  standalone: true,
  styleUrls: ['./download.component.scss'],
  templateUrl: './download.component.html'
})
export class DownloadComponent extends BaseComponent implements OnInit {
  releaseName: string | undefined;
  releaseLinkWindows: string | undefined;
  releaseLinkMac: string | undefined;
  releaseLinkLinux: string | undefined;

  isXs = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(({ matches }) => matches));
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));

  constructor(
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private store: Store
  ) { super(); }

  ngOnInit(): void {
    this.store.select(ReleasesState.releases)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(releases => {
        const latest = releases.find(release => !release.prerelease);

        this.releaseName = latest?.tag_name;
        this.releaseLinkWindows = latest?.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url;
        this.releaseLinkMac = latest?.assets.find(a => a.name.endsWith('.dmg'))?.browser_download_url;
        this.releaseLinkLinux = latest?.assets.find(a => a.name.endsWith('.AppImage'))?.browser_download_url;
        this.cdr.markForCheck();
      });
  }
}
