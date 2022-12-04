import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsComponent } from './docs.component';
import { DocsResolver } from './docs.resolver';

const routes: Routes = [
  {
    path: ':file',
    component: DocsComponent,
    data: { title: '${toTitle(file)} - Docs' },
    resolve: { doc: DocsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule {}
