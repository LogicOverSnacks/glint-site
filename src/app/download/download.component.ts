import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { GithubService, IRelease } from '../shared/github.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-download',
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
    private http: HttpClient,
    private githubService: GithubService
  ) {}

  ngOnInit(): void {
    this.http.get<IRelease[]>('/assets/releases.json')
      .pipe(catchError(() => this.githubService.getReleases()))
      .subscribe(releases => {
        this.update(releases);
      });
  }

  private update(releases: IRelease[]) {
    const latest = releases.find(release => release.prerelease = false);
    const beta = releases[0];

    this.releaseName = latest?.name;
    this.betaReleaseName = beta?.name;
    this.releaseLinkWindows = beta.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url;
    this.releaseLinkMac = beta.assets.find(a => a.name.endsWith('.dmg'))?.browser_download_url;
    this.releaseLinkLinux = beta.assets.find(a => a.name.endsWith('.AppImage'))?.browser_download_url;
    this.cdr.markForCheck();
  }
}
