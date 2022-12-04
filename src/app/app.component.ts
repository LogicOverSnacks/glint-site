import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenavContent } from '@angular/material/sidenav';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { catchError, filter, map, Observable, takeUntil } from 'rxjs';

import { BaseComponent } from './shared/base.component';
import { GithubService } from './shared/github.service';
import { Release } from './shared/models/release';
import { AuthState } from './state/auth.state';
import { Update } from './state/releases.state';
import { UserVm } from './state/user.vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent extends BaseComponent implements OnInit {
  @Select(AuthState.user)
  user!: Observable<UserVm | null>;

  @ViewChild(MatSidenavContent)
  matSidenavContent!: MatSidenavContent;

  currentYear = new Date().getFullYear();
  xsQuery = this.media.asObservable().pipe(map(changes => changes.some(change => change.mqAlias === 'xs' && change.matches)));

  constructor(
    sanitizer: DomSanitizer,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    private media: MediaObserver,
    router: Router,
    titleService: Title,
    private store: Store,
    private githubService: GithubService
  ) {
    super();

    iconRegistry.addSvgIcon('glint', sanitizer.bypassSecurityTrustResourceUrl('/assets/glint.svg'));

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let snapshot = router.routerState.snapshot.root;
        let title: string = snapshot.data?.title ?? '';
        let params = snapshot.params;

        while (snapshot.firstChild) {
          snapshot = snapshot.firstChild;
          title = snapshot.data?.title ?? title;
          params = { ...params, ...snapshot.params };
        }

        title = Object.entries(params).reduce(
          (acc, [key, value]) => acc
            .replace(`\${toTitle(${key})}`, this.toTitle(value))
            .replace(`\${${key}}`, value),
          title
        );

        titleService.setTitle(title
          ? `${title} - Glint`
          : `Glint: A Graphical Interface for Git`
        );

        // manually scroll to top on route change due to https://github.com/angular/components/issues/4280
        this.matSidenavContent.scrollTo({ top: 0 });
      });
  }

  ngOnInit() {
    this.http.get<Release[]>('/assets/releases.json')
      .pipe(
        catchError(() => this.githubService.getReleases()),
        takeUntil(this.destroyed$)
      )
      .subscribe(releases => {
        this.store.dispatch(new Update(releases));
      });
  }

  private toTitle = (value: string) => value
    .split('-')
    .map(text => text
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
    )
    .reverse()
    .join(' - ');
}
