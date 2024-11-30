import { transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
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
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { unescape } from 'lodash-es';
import { MarkdownModule } from 'ngx-markdown';
import { BehaviorSubject, map, takeUntil } from 'rxjs';

import { BaseComponent } from '../shared';
import { ContainerComponent } from '../shared/container.component';

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
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MarkdownModule,

    ContainerComponent
  ],
  styleUrls: ['./docs.component.scss'],
  templateUrl: './docs.component.html'
})
export class DocsComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('markdown', { read: ElementRef, static: true })
  markdownElement!: ElementRef<HTMLElement>;

  @ViewChildren(MatExpansionPanel)
  expansionPanels!: QueryList<MatExpansionPanel>;

  // search = new FormControl<string | null>(null);
  articleContent = new BehaviorSubject('');
  headings = new BehaviorSubject<Heading[]>([]);
  loading = new BehaviorSubject(false);

  isXl = this.breakpointObserver.observe([Breakpoints.XLarge]).pipe(map(state => state.matches));
  ltMd = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(state => state.matches));

  /* eslint-disable quote-props */
  /* eslint-disable @typescript-eslint/naming-convention */
  topics = [
    {
      title: $localize`Get Started`,
      articles: [
        { title: $localize`Overview`, file: $localize`get_started` },
        { title: $localize`Installation`, file: $localize`installation` },
        { title: $localize`Troubleshooting`, file: $localize`troubleshooting` }
      ]
    },
    {
      title: $localize`User Interface`,
      articles: [
        { title: $localize`Overview`, file: $localize`user_interface` },
        { title: $localize`Diff View`, file: $localize`user_interface-diff_view` },
        // { title: $localize`Commit View`, file: $localize`user_interface-commit_view` },
        { title: $localize`Merge View`, file: $localize`user_interface-merge_view` },
        { title: $localize`Pull Request View`, file: $localize`user_interface-pull_request_view` },
        { title: $localize`Search View`, file: $localize`user_interface-search_view` },
        // { title: $localize`Settings View`, file: $localize`user_interface-settings_view` },
      ]
    },
    {
      title: $localize`Configuration`,
      articles: [
        { title: $localize`Cloud Integrations`, file: $localize`cloud_integrations` },
        { title: $localize`Credentials`, file: $localize`credentials` },
        { title: $localize`Profiles`, file: $localize`profiles` },
      ]
    },
    // {
    //   title: $localize`Merges`,
    //   articles: [
    //     { title: $localize``, file: $localize`` }
    //   ]
    // },
    // {
    //   title: $localize`Submodules`,
    //   articles: [
    //     { title: $localize`Add`, file: $localize`add-a-submodule` },
    //     { title: $localize`Open`, file: $localize`open-a-submodule` },
    //     { title: $localize`Remove`, file: $localize`remove-a-submodule` }
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
    this.articleContent
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.loading.next(true));

    this.route.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.articleContent.next(data.doc ?? '');
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
