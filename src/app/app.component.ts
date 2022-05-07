import { Component } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { filter, map, Observable } from 'rxjs';

import { BaseComponent } from './shared/base.component';
import { AuthState } from './state/auth.state';
import { UserVm } from './state/user.vm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  @Select(AuthState.user)
  user!: Observable<UserVm | null>;

  currentYear = new Date().getFullYear();
  xsQuery = this.media.asObservable().pipe(map(changes => changes.some(change => change.mqAlias === 'xs' && change.matches)));

  constructor(
    sanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
    private media: MediaObserver,
    router: Router,
    titleService: Title
  ) {
    super();

    iconRegistry.addSvgIcon('glint', sanitizer.bypassSecurityTrustResourceUrl('/assets/glint.svg'));

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let snapshot = router.routerState.snapshot.root;
        let title: string = snapshot.data?.['title'] ?? '';

        while (snapshot.firstChild) {
          snapshot = snapshot.firstChild;
          title = snapshot.data?.['title'] ?? title;
        }

        titleService.setTitle(`Glint${title ? ' - ' + title : ''}`);
      });
  }
}
