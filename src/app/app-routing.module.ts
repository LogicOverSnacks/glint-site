import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.components';
import { DocsComponent } from './docs/docs.component';
import { DownloadComponent } from './download/download.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent, data: { title: 'About' } },
  { path: 'docs', component: DocsComponent, data: { title: 'Documentation' } },
  { path: 'download', component: DownloadComponent, data: { title: 'Download' } },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
