import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, finalize, throwError } from 'rxjs';

import { ApiService } from '../shared/api.service';
import { CurrencyService } from '../shared/currency.service';
import { AuthState, Logout } from '../state/auth.state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
      text-align: center;
    }`,
    `
      @use '@angular/material' as mat;
      @use 'src/theme' as theme;

      .free, .premium {
        margin-bottom: 20px;
        padding-top: 40px;
      }

      .free {
      }

      .premium {
        .mat-display-1 {
          color: mat.get-color-from-palette(theme.$app-accent-palette, A100);
        }
      }

      .mat-display-1 {
        margin-bottom: 20px;
        font-family: 'Alegreya Sans SC', sans-serif;
        letter-spacing: 0.1rem;
      }

      .purchase-btn {
        display: block;
        margin: 20px auto;
      }

      .link { color: mat.get-color-from-palette(theme.$app-primary-palette, 300); }

      .features {
        margin: 20px 0 0 0;
        padding: 0;
        list-style: none;
        text-align: left;

        .item {
          border-radius: 4px;
          margin-bottom: 10px;
          padding: 10px;
          vertical-align: middle;

          &:last-child {
            margin-bottom: 0;
          }

          mat-icon {
            margin-right: 10px;
            vertical-align: middle;
          }
        }

        .highlight {
          background-color: mat.get-color-from-palette(theme.$app-primary-palette, 900);
        }
      }

      .faq-panel {
        margin-top: 40px;
        text-align: left;

        .title {
          margin-bottom: 40px;
          text-align: center;
        }

        h3 {
          font-size: 28px;
          color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
          margin-top: 40px;
        }

        &.small h3 {
          font-size: 22px;
        }
      }

      .enquire-panel {
        margin-top: 60px;

        .title {
          margin-bottom: 40px;
        }
      }
    `
  ],
  template: `
    <app-container fxLayout="row" fxLayoutAlign="space-between" fxLayout.lt-md="column-reverse">
      <mat-card class="free" fxFlex="45">
        <h2 class="mat-display-1">Basic</h2>

        <h3 class="price">Free</h3>

        <a class="purchase-btn" routerLink="/download">
          <button mat-stroked-button>
            Download
          </button>
        </a>

        <ul class="features">
          <li class="item"><mat-icon>public</mat-icon>Work with public &amp; private repositories</li>
          <li class="item"><mat-icon>tab</mat-icon>Two tabs</li>
          <li class="item"><mat-icon>commit</mat-icon>Visual commit graph</li>
          <li class="item"><mat-icon>difference</mat-icon>View diffs with full syntax highlighting</li>
          <li class="item"><mat-icon>build</mat-icon>Resolve merge conflicts</li>
          <li class="item"><mat-icon>layers</mat-icon>Work with submodules</li>
          <li class="item"><mat-icon>edit</mat-icon>Rewrite commit history</li>
          <li class="item"><mat-icon>search</mat-icon>Search files &amp; commits</li>
          <li class="item"><mat-icon>visibility_off</mat-icon>Show/hide branches</li>
          <li class="item"><mat-icon>merge_type</mat-icon>Manage multiple merges simultaneously</li>
          <li class="item"><mat-icon>key</mat-icon>Manage credentials</li>
          <li class="item"><mat-icon>group</mat-icon>Quickly switch profiles</li>
          <li class="item"><mat-icon>dark_mode</mat-icon>Dark theme</li>
          <!-- <li class="item">
            <span matTooltip="Feature not yet available">
              <mat-icon>compress</mat-icon>
              <del>Squash commits</del>
            </span>
          </li>
          <li class="item">
            <span matTooltip="Feature not yet available">
              <mat-icon>description</mat-icon>
              <del>Blame files</del>
            </span>
          </li>
          <li class="item">
            <span matTooltip="Feature not yet available">
              <mat-icon>undo</mat-icon>
              <del>Undo actions</del>
            </span>
          </li>
          <li class="item">
            <span matTooltip="Feature not yet available">
              <mat-icon>touch_app</mat-icon>
              <del>Drag &amp; Drop</del>
            </span>
          </li>
          <li class="item">
            <span matTooltip="Feature not yet available">
              <mat-icon>verified</mat-icon>
              <del>Commit signing</del>
            </span>
          </li> -->
        </ul>
      </mat-card>
      <mat-card class="premium" fxFlex="45">
        <h2 class="mat-display-1">Premium</h2>

        <h3 class="price">{{price}} / user / month</h3>

        <button class="purchase-btn" mat-stroked-button color="accent" (click)="buyLicense()">
          Buy License
        </button>

        <div class="errors" *ngIf="purchaseError | async as error">
          <mat-icon inline>warning</mat-icon> {{ error }}
        </div>

        <ul class="features">
          <li class="item highlight">
            <mat-icon>check</mat-icon>All basic features
          </li>
          <li class="item"><mat-icon>tab</mat-icon>Unlimited tabs</li>
          <!-- <li class="item">
            <span matTooltip="Feature not yet available">
              <mat-icon>light_mode</mat-icon>
              <del>Light theme</del>
            </span>
          </li> -->
        </ul>
      </mat-card>
    </app-container>

    <app-container>
      <div class="faq-panel" ngClass.lt-sm="small">
        <h2 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">FAQs</h2>

        <h3>Is Glint free to use for commercial projects?</h3>
        <p>
          Yes! You only need to pay for the listed premium features.
        </p>

        <h3>What operating systems does Glint work on?</h3>
        <p>Windows, macOS, and Linux. Only x64 systems and Apple M1 (arm64) are supported. The application is designed for use on desktop computers, and so there is no version available for mobile devices or web browsers.</p>

        <h3>Can I use Glint on multiple computers?</h3>
        <p>Yes, you can use a single subscription on multiple devices, just log in with the same account.</p>

        <h3>Do I need to install any dependencies?</h3>
        <p>No, all dependencies are included in the installation package.</p>

        <h3>Can I purchase subscriptions for team members?</h3>
        <p>Yes, you can purchase multiple subscriptions and assign them to other users on the <a routerLink="/account" class="link">account</a> page. You don't need to have your own subscription to do this.</p>

        <h3>What is your refund policy?</h3>
        <p>All payments are non-refundable, but you can cancel your subscription at any time. Upon cancellation, you will still receive the premium benefits until the end of your billing period.</p>
      </div>

      <div class="enquire-panel">
        <h2 class="title" ngClass.lt-sm="mat-display-1" ngClass.gt-xs="mat-display-2">Further Questions?</h2>
        <a routerLink="/contact" class="link">Click here to enquire</a>
      </div>
    </app-container>
  `
})
export class PricingComponent {
  purchaseError = new BehaviorSubject<string | null>(null);
  price: string;

  private processing = false;
  private currency: 'GBP' | 'EUR' | 'USD';

  constructor(
    private router: Router,
    private store: Store,
    private api: ApiService,
    currencyService: CurrencyService
  ) {
    this.currency = currencyService.getCurrency();
    this.price = this.currency === 'GBP' ? '£4'
      : this.currency === 'EUR' ? '€4.50'
      : '$4.50';
  }

  buyLicense() {
    const user = this.store.selectSnapshot(AuthState.user);
    if (!user) {
      this.router.navigate(['/account']);
      return;
    }

    this.api.getSubscriptions()
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 403) this.store.dispatch(new Logout()).subscribe(() => this.router.navigate(['/account']));

          return throwError(() => response);
        })
      )
      .subscribe(({ using }) => {
        if (using.length > 0) this.router.navigate(['/account']);
        else this.purchase();
      });
  }

  private purchase() {
    if (this.processing) return;

    this.processing = true;

    this.api.purchaseSubscriptions(1, true, this.currency)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const code = response.status === 400 && response.error.reason === 'validation' ? '400PA'
            : response.status === 400 ? '400PB'
            : '500PA';

          this.purchaseError.next(
            `There was a problem processing the request. Please email support at help@glint.info quoting code ${code}.`
          );

          return throwError(() => response);
        }),
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe(url => {
        this.purchaseError.next(null);
        if (url) window.location.href = url;
      });
  }
}
