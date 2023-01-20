import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cookie-banner',
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    footer {
      padding: 0 8px 8px 8px;

      button {
        margin-right: 5px;

        &.details-btn {
          --mat-mdc-snack-bar-button-color: var(--mdc-snackbar-supporting-text-color, inherit);
        }

        &.dismiss-btn {
          --mat-mdc-snack-bar-button-color: #{mat.get-color-from-palette(theme.$app-primary-palette, 700)};
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  `],
  template: `
    <div matSnackBarLabel>
      This site uses cookies from Google to deliver its services and to analyze traffic.
    </div>
    <footer matSnackBarActions>
      <button type="button" mat-button matSnackBarAction class="details-btn" routerLink="/cookies">More Details</button>
      <button type="button" mat-button matSnackBarAction class="dismiss-btn" (click)="snackBarRef.dismissWithAction()">OK, got it</button>
    </footer>
  `,
})
export class CookieBannerComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    public snackBarRef: MatSnackBarRef<boolean>
  ) {}
}
