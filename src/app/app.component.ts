import { Component } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { BaseComponent } from './shared/base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  currentYear = new Date().getFullYear();
  xsQuery = this.media.asObservable().pipe(map(changes => changes.some(change => change.mqAlias === 'xs' && change.matches)));

  constructor(
    private media: MediaObserver,
    router: Router,
    titleService: Title
  ) {
    super();

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
