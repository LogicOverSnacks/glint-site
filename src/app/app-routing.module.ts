import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DownloadComponent } from './download/download.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'docs', component: DocumentationComponent, data: { title: 'Documentation' } },
  { path: 'download', component: DownloadComponent, data: { title: 'Download' } },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
