import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';

import { SharedModule } from '../shared/shared.module';
import { DocsRoutingModule } from './docs-routing.module';
import { DocsComponent } from './docs.component';

@NgModule({
  imports: [
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MarkdownModule.forRoot(),

    SharedModule,
    DocsRoutingModule
  ],
  declarations: [
    DocsComponent
  ]
})
export class DocsModule {}