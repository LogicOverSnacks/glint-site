import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./terms.component.scss'],
  templateUrl: './terms.component.html'
})
export class TermsComponent {}
