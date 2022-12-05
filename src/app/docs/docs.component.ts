import { transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { unescape } from 'lodash-es';
import { BehaviorSubject, map, takeUntil } from 'rxjs';

import { BaseComponent } from '../shared';

interface Heading {
  id: string;
  title: string;
  active: boolean;
}

@Component({
  animations: [
    trigger('null', [
      transition(':enter', []),
      transition(':leave', [])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./docs.component.scss'],
  templateUrl: './docs.component.html'
})
export class DocsComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('markdown', { read: ElementRef, static: true })
  markdownElement!: ElementRef<HTMLElement>;

  @ViewChildren(MatExpansionPanel)
  expansionPanels!: QueryList<MatExpansionPanel>;

  // search = new FormControl<string | null>(null);
  article = new BehaviorSubject('');
  headings = new BehaviorSubject<Heading[]>([]);
  loading = new BehaviorSubject(false);

  isXl = this.breakpointObserver.observe([Breakpoints.XLarge]).pipe(map(state => state.matches));
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(state => state.matches));

  /* eslint-disable quote-props */
  /* eslint-disable @typescript-eslint/naming-convention */
  topics = [
    {
      title: 'Get Started',
      articles: [
        { title: 'Overview', file: 'get_started' },
        { title: 'Installation', file: 'installation' }
      ]
    },
    {
      title: 'User Interface',
      articles: [
        { title: 'Overview', file: 'user_interface' },
        { title: 'Diff View', file: 'user_interface-diff_view' },
        // { title: 'Commit View', file: 'user-interface-commit_view' },
        // { title: 'Merge View', file: 'user-interface-merge_view' },
        // { title: 'Settings View', file: 'user-interface-settings_view' },
      ]
    },
    {
      title: 'Configuration',
      articles: [
        { title: 'Cloud Integrations', file: 'cloud_integrations' },
        { title: 'Credentials', file: 'credentials' },
        { title: 'Profiles', file: 'profiles' },
      ]
    },
    // {
    //   title: 'Merges',
    //   articles: [
    //     { title: '', file: '' }
    //   ]
    // },
    // {
    //   title: 'Submodules',
    //   articles: [
    //     { title: 'Add', file: 'add-a-submodule' },
    //     { title: 'Open', file: 'open-a-submodule' },
    //     { title: 'Remove', file: 'remove-a-submodule' }
    //   ]
    // }
  ];
  /* eslint-enable @typescript-eslint/naming-convention */
  /* eslint-enable quote-props */

  private fragment: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { super(); }

  ngOnInit() {
    this.article
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.loading.next(true));

    this.route.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.article.next(data.doc ?? '');
      });

    this.route.fragment
      .pipe(takeUntil(this.destroyed$))
      .subscribe(fragment => {
        this.fragment = fragment;
        if (!this.loading.value) {
          const headingElements = Array.from(this.markdownElement.nativeElement.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'));
          this.scrollToHeading(headingElements, fragment);
        }
      });

    // this.tutorialSearch.valueChanges
    //   .pipe(
    //     debounceTime(200),
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe(searchTerm => {
    //     if (searchTerm)
    //       this.filteredTutorials = this.tutorials.filter(name => name.includes(searchTerm.toLowerCase()));
    //     else
    //       this.filteredTutorials = this.tutorials;

    //     this.cdr.detectChanges();
    //   });
  }

  ngAfterViewInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe(paramMap => {
        const currentFile = paramMap.get('file');
        if (currentFile) {
          const index = this.topics.findIndex(({ articles }) => articles.some(({ file }) => file === currentFile));

          if (index >= 0) {
            const ltMd = this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small]);
            this.expansionPanels.get(ltMd ? 1 + index : index)?.open();
          }

          this.cdr.detectChanges();
        }
      });
  }

  loaded() {
    this.loading.next(false);
    const headingElements = Array.from(this.markdownElement.nativeElement.querySelectorAll<HTMLElement>('h2'));
    for (const heading of headingElements)
      heading.id = this.headingToId(unescape(heading.innerHTML));

    const headings = headingElements.map(element => ({
      id: element.id,
      title: element.innerText,
      active: false
    }));

    const observer = new window.IntersectionObserver(entries => {
      const currentHeadings = this.headings.value;

      const newlyIntersecting = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id);

      const activeHeading = currentHeadings.find(heading => newlyIntersecting.includes(heading.id));
      if (activeHeading) {
        for (const heading of currentHeadings)
          heading.active = heading === activeHeading;

        this.headings.next(currentHeadings);
      }

      // for (const heading of currentHeadings) {
      //   if (newlyIntersecting.includes(heading.id)) {
      //     this.headings.next(currentHeadings.map(h => h === heading ? () );
      //     break;
      //   }
      // }

      // for (const entry of entries) {
      //   const heading = currentHeadings.find(({ id }) => id === entry.target.id);
      //   if (heading)
      //     heading.active = entry.isIntersecting;
      // }

    });

    for (const element of headingElements)
      observer.observe(element);

    this.headings.next(headings);

    if (this.fragment) {
      setTimeout(() => {
        this.scrollToHeading(headingElements, this.fragment);
      }, 500);
    }

    this.cdr.detectChanges();
  }

  markdownClicked(event: MouseEvent) {
    event.stopPropagation();
    const element = (event.target as HTMLElement);

    if (element?.nodeName === 'A') {
      const link = element.getAttribute('href');

      if (link?.startsWith('/')) {
        event.preventDefault();
        const [route, fragment] = link.split('#');
        this.router.navigate([route], { fragment });
      }
    }
  }

  headingToId = (heading: string) => encodeURIComponent(heading.replace(/ /g, '_'));
  toTitle = (value: string) => value.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

  trackByHeading(id: number, heading: Heading) {
    return heading.id;
  }

  private scrollToHeading(headingElements: HTMLElement[], fragment: string | null) {
    setTimeout(() => {
      headingElements
        .find(element => element.id.toLowerCase() === fragment?.toLowerCase())
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
}
