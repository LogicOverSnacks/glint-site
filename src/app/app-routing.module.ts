import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { LostPasswordComponent } from './auth/lost-password.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { DocsComponent } from './docs/docs.component';
import { DownloadComponent } from './download/download.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent, data: { title: 'About' } },
  { path: 'docs', component: DocsComponent, data: { title: 'Documentation' } },
  { path: 'download', component: DownloadComponent, data: { title: 'Download' } },
  { path: 'faq', component: FaqComponent, data: { title: 'Frequently Asked Questions' } },
  { path: 'playground', component: PlaygroundComponent, data: { title: 'Playground' } },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent, data: { title: 'Confirm Email' } },
  { path: 'auth/lost-password', component: LostPasswordComponent, data: { title: 'Lost Password' } },
  { path: 'auth/reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
