import { HttpClient } from '@angular/common/http';
import { importProvidersFrom, inject, SecurityContext } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { catchError, EMPTY } from 'rxjs';

import { DocsComponent } from './docs.component';

export default [
  {
    path: ':file',
    component: DocsComponent,
    data: { title: `\${toTitle(file)} - ${$localize`Docs`}` },
    providers: [
      importProvidersFrom(MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }))
    ],
    resolve: {
      doc: (route: ActivatedRouteSnapshot) => {
        const router = inject(Router);
        return inject(HttpClient).get(`/assets/docs/${route.paramMap.get('file')}.md`, { responseType: 'text' }).pipe(
          catchError(() => {
            router.navigate(['/not-found']);
            return EMPTY;
          })
        );
      }
    }
  }
] as Routes;
