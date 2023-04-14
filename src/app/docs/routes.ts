import { importProvidersFrom, SecurityContext } from '@angular/core';
import { Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { DocsComponent } from './docs.component';
import { DocsResolver } from './docs.resolver';

export default [
  {
    path: ':file',
    component: DocsComponent,
    data: { title: `\${toTitle(file)} - ${$localize`Docs`}` },
    providers: [
      importProvidersFrom(MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }))
    ],
    resolve: { doc: DocsResolver }
  }
] as Routes;
