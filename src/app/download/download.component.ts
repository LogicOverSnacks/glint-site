import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs';

import { BaseComponent } from '../shared';
import { ReleasesState } from '../state/releases.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-download',
  styleUrls: ['./download.component.scss'],
  templateUrl: './download.component.html'
})
export class DownloadComponent extends BaseComponent implements OnInit {
  releaseName: string | undefined;
  releaseLinkWindows: string | undefined;
  releaseLinkMac: string | undefined;
  releaseLinkLinux: string | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
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
