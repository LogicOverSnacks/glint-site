import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    router: Router,
    titleService: Title
  ) {
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
