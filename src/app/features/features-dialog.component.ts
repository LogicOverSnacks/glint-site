import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  styles: [`
    img {
      max-width: 100%;
    }
  `],
  template: `
    <mat-dialog-content (click)="dialogRef.close()">
      <img [src]="data" alt="Screenshot of Glint" i18n-alt>
    </mat-dialog-content>
  `
})
export class FeaturesDialogComponent {
  data = inject<string>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<FeaturesDialogComponent>);
}
