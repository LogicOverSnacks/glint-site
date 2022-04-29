import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { RegisterComponent } from './auth/register.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { DocsComponent } from './docs/docs.component';
import { DownloadComponent } from './download/download.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs', component: DocsComponent, data: { title: 'Documentation' } },
  { path: 'download', component: DownloadComponent, data: { title: 'Download' } },
  { path: 'faq', component: FaqComponent, data: { title: 'Frequently Asked Questions' } },
  { path: 'playground', component: PlaygroundComponent, data: { title: 'Playground' } },
  { path: 'pricing', component: PricingComponent, data: { title: 'Pricing' } },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent, data: { title: 'Confirm Email' } },
  { path: 'auth/register', component: RegisterComponent, data: { title: 'Register' } },
  { path: 'auth/reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
