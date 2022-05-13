import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, finalize, throwError } from 'rxjs';

import { ApiService } from '../shared/api.service';
import { AuthState } from '../state/auth.state';

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

      .enquire-panel {
        margin-top: 20px;
      }
    `
  ],
  template: `
    <app-container fxLayout="row" fxLayoutAlign="space-between" fxLayout.lt-md="column-reverse">
      <mat-card class="free" fxFlex="45">
        <div class="mat-display-1">Basic</div>

        <div class="price">Free</div>

        <a class="purchase-btn" routerLink="/download">
          <button mat-stroked-button>
            Download
          </button>
        </a>

        <ul class="features">
          <li class="item"><mat-icon>commit</mat-icon>Visual commit graph</li>
          <li class="item"><mat-icon>tab</mat-icon>One tab</li>
          <li class="item"><mat-icon>public</mat-icon>Work with local &amp; public repositories</li>
          <li class="item"><mat-icon>difference</mat-icon>View diffs</li>
          <li class="item"><mat-icon>build</mat-icon>Resolve merge conflicts</li>
          <li class="item"><mat-icon>layers</mat-icon>Work with submodules</li>
          <li class="item"><mat-icon>edit</mat-icon>Rewrite commit history</li>
          <li class="item"><mat-icon>search</mat-icon>Search files &amp; commits</li>
          <li class="item"><mat-icon>visibility_off</mat-icon>Show/hide branches</li>
          <li class="item"><mat-icon>merge_type</mat-icon>Merge non-checked-out branches</li>
        </ul>
      </mat-card>
      <mat-card class="premium" fxFlex="45">
        <div class="mat-display-1">Premium</div>

        <div class="price">£4 / user / month</div>

        <button class="purchase-btn" mat-stroked-button color="accent" (click)="buyLicense()">
          Buy License
        </button>

        <div class="errors" *ngIf="purchaseError | async as error">
          <mat-icon inline>warning</mat-icon> {{ error }}
        </div>

        <ul class="features">
          <li class="item highlight">
            <mat-icon>check</mat-icon>All free features
          </li>
          <li class="item"><mat-icon>tab</mat-icon>Unlimited tabs</li>
          <li class="item"><mat-icon>lock</mat-icon>Work with private repositories</li>
        </ul>
      </mat-card>
    </app-container>

    <div class="enquire-panel">
      <h2>Questions?</h2>
      <div class="price"><a href="mailto:sales@glint.info" class="link">Enquire</a></div>
    </div>
  `
})
export class PricingComponent {
  purchaseError = new BehaviorSubject<string | null>(null);

  private processing = false;

  constructor(
    private router: Router,
    private store: Store,
    private api: ApiService
  ) {}

  buyLicense() {
    const user = this.store.selectSnapshot(AuthState.user);
    if (!user) {
      this.router.navigate(['/download']);
      return;
    }

    if (this.processing) return;

    this.processing = true;

    this.api.purchaseSubscriptions(1, true)
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
