import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { catchError, filter, map, Observable, takeUntil } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CookieBannerComponent } from './cookie-banner.component';
import { BaseComponent } from './shared/base.component';
import { CanonicalService } from './shared/canonical.service';
import { GithubService } from './shared/github.service';
import { Release } from './shared/models/release';
import { AuthState, ConsentToCookies } from './state/auth.state';
import { Update } from './state/releases.state';
import { UserVm } from './state/user.vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  standalone: true,
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
  languageControl = new FormControl<'en' | 'zh'>('en', { nonNullable: true });

  isXs = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(({ matches }) => matches));
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches));
  ltLg = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).pipe(map(({ matches }) => matches));

  constructor(
    sanitizer: DomSanitizer,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    router: Router,
    titleService: Title,
    private store: Store,
    canonicalService: CanonicalService,
    private githubService: GithubService
  ) {
    super();

    if (!environment.production)
      (window as any)[`ga-disable-${environment.googleMeasurementId}`] = true;

    const cookieConsent = store.selectSnapshot(AuthState.cookieConsent);
    if (!cookieConsent) {
      snackBar
        .openFromComponent(CookieBannerComponent)
        .afterDismissed()
        .subscribe(dismiss => {
          if (dismiss.dismissedByAction) store.dispatch(new ConsentToCookies());
        });
    }

    iconRegistry.addSvgIcon('glint', sanitizer.bypassSecurityTrustResourceUrl('/assets/glint.svg'));
    iconRegistry.addSvgIcon('pull-request', sanitizer.bypassSecurityTrustResourceUrl('/assets/pull-request.svg'));

    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
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
          : $localize`Glint: A Graphical Interface for Git`
        );

        canonicalService.updateCanonicalLink();

        // manually scroll to top on route change due to https://github.com/angular/components/issues/4280
        this.matSidenavContent.scrollTo({ top: 0 });

        // eslint-disable-next-line @typescript-eslint/naming-convention
        gtag('config', environment.googleMeasurementId, { page_path: event.urlAfterRedirects });
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

    this.languageControl.setValue(window.location.href.includes('/zh/') ? 'zh' : 'en');
    this.languageControl.valueChanges.subscribe(language => {
      window.location.href = window.location.href.replace(/\/(en|zh)\//, `/${language}/`);
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
