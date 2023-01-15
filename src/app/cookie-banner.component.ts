import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cookie-banner',
  styles: [`
    footer {
      padding: 0 8px 8px 8px;

      button {
        --mat-mdc-snack-bar-button-color: var(--mdc-text-button-label-text-color, inherit);
        margin-right: 5px;

        &:not(.mat-primary) {
          --mat-mdc-snack-bar-button-color: #000;
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
      <button type="button" mat-button matSnackBarAction routerLink="/cookies">More Details</button>
      <button type="button" mat-button matSnackBarAction color="primary" (click)="snackBarRef.dismissWithAction()">OK, got it</button>
    </footer>
  `,
})
export class CookieBannerComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    public snackBarRef: MatSnackBarRef<boolean>
  ) {}
}
