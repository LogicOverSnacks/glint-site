import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { GithubService } from '../shared/github.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./download.component.scss'],
  templateUrl: './download.component.html'
})
export class DownloadComponent implements OnInit {
  releaseName: string | undefined;
  betaReleaseName: string | undefined;
  releaseLinkWindows: string | undefined;
  releaseLinkMac: string | undefined;
  releaseLinkLinux: string | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private githubService: GithubService
  ) {}

  ngOnInit(): void {
    this.githubService.getReleases()
      .subscribe(releases => {
        const latest = releases.find(release => release.prerelease = false);
        const beta = releases[0];

        this.releaseName = latest?.name;
        this.betaReleaseName = beta?.name;
        this.releaseLinkWindows = beta.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url;
        this.releaseLinkMac = beta.assets.find(a => a.name.endsWith('.dmg'))?.browser_download_url;
        this.releaseLinkLinux = beta.assets.find(a => a.name.endsWith('.AppImage'))?.browser_download_url;
        this.cdr.markForCheck();
      });
  }
}
