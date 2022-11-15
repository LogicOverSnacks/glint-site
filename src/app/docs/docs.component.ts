import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @use '@angular/material' as mat;
    @use 'src/theme' as theme;

    :host {
      display: block;
      padding-top: 40px;
    }

    a {
      color: mat.get-color-from-palette(theme.$app-primary-palette, 300);
    }
  `],
  template: `
    <app-container>
      <h2>Overview</h2>

      <h2>Tutorials</h2>
      <ul>
        <li *ngFor="let link of links"><a [routerLink]="'./' + link">{{toTitle(link)}}</a></li>
      </ul>
    </app-container>
  `
})
export class DocsComponent {
  links = [
    'checkout-a-branch',
    'clone-a-repository',
    'setup-a-cloud-integration'
  ];

  toTitle = (value: string) => value.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}
