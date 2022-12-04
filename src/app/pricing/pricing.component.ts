import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, catchError, finalize, map, Observable, startWith, throwError } from 'rxjs';

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

      .price {
        line-height: 32px;

        mat-form-field {
          width: 75px;

          ::ng-deep {
            .mat-form-field-wrapper {
              margin-bottom: -1.25em;
            }

            .mat-form-field-infix {
              border-top: none;
            }
          }
        }
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
          <li class="item"><mat-icon>tab</mat-icon>Use up to two tabs simultaneously</li>
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
          <li class="item"><mat-icon>compress</mat-icon>Squash commits</li>
          <li class="item"><mat-icon>description</mat-icon>Blame files</li>
          <!-- <li class="item">
            <span>
              <mat-icon>undo</mat-icon>
              <del>Undo actions</del>
            </span>
          </li>
          <li class="item">
            <span>
              <mat-icon>touch_app</mat-icon>
              <del>Drag &amp; Drop</del>
            </span>
          </li>
          <li class="item">
            <span>
              <mat-icon>verified</mat-icon>
              <del>Commit signing</del>
            </span>
          </li> -->
        </ul>
      </mat-card>
      <mat-card class="premium" fxFlex="45">
        <h2 class="mat-display-1">Premium</h2>

        <h3 class="price">
          {{price | async}} /
          <mat-form-field>
            <mat-select [formControl]="frequencyControl">
              <mat-option value="month">Month</mat-option>
              <mat-option value="year">Year</mat-option>
            </mat-select>
          </mat-form-field>
        </h3>

        <button class="purchase-btn" mat-stroked-button color="accent" (click)="buyLicense()">
          Buy License
        </button>

        <div class="errors" *ngIf="purchaseError | async as error">
          <mat-icon inline>warning</mat-icon>
          There was a problem processing the request.
          Please <a class="link" routerLink="/contact">contact us</a> quoting code {{ error }}.
        </div>

        <ul class="features">
          <li class="item highlight">
            <mat-icon>check</mat-icon>All basic features
          </li>
          <li class="item"><mat-icon>tab</mat-icon>Unlimited tabs</li>
          <!-- <li class="item">
            <span>
              <mat-icon>light_mode</mat-icon>
              <del>Light theme</del>
            </span>
          </li> -->
        </ul>
      </mat-card>
    </app-container>
  `
})
export class PricingComponent {
  purchaseError = new BehaviorSubject<string | null>(null);
  price: Observable<string>;
  frequencyControl = new FormControl<'month' | 'year'>('year', { nonNullable: true });

  private processing = false;
  private currency: 'GBP' | 'EUR' | 'USD';

  constructor(
    private router: Router,
    private store: Store,
    private api: ApiService,
    currencyService: CurrencyService
  ) {
    this.currency = currencyService.getCurrency();
    this.price = this.frequencyControl.valueChanges.pipe(
      startWith(this.frequencyControl.value),
      map(frequency =>
        this.currency === 'GBP' ? frequency === 'month' ? '£4' : '£35'
        : this.currency === 'EUR' ? frequency === 'month' ? '€4' : '€35'
        : frequency === 'month' ? '$4' : '$35'
      )
    );
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

    this.api.purchaseSubscriptions(1, true, this.currency, this.frequencyControl.value)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const code = response.status === 400 && response.error.reason === 'validation' ? '400PA'
            : response.status === 400 ? '400PB'
            : response.status === 403 && response.error.reason === 'unverified' ? '403PA'
            : '500PA';

          if (code === '403PA')
            this.router.navigate(['/account/email/not-confirmed']);
          else
            this.purchaseError.next(code);

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
