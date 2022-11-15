import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { ContactComponent } from './contact/contact.component';
import { DocComponent } from './docs/doc.component';
import { DocsComponent } from './docs/docs.component';
import { DocsResolver } from './docs/docs.resolver';
import { DownloadComponent } from './download/download.component';
import { EulaComponent } from './eula/eula.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent, data: { title: 'Contact' } },
  { path: 'docs', component: DocsComponent, data: { title: 'Documentation' } },
  {
    path: 'docs/:file',
    component: DocComponent,
    data: { title: '${toTitle(file)} - Documentation' },
    resolve: { doc: DocsResolver }
  },
  { path: 'download', component: DownloadComponent, data: { title: 'Download' } },
  { path: 'eula', component: EulaComponent, data: { title: 'End User License Agreement' } },
  { path: 'faq', component: FaqComponent, data: { title: 'Frequently Asked Questions' } },
  { path: 'playground', component: PlaygroundComponent, data: { title: 'Playground' } },
  { path: 'pricing', component: PricingComponent, data: { title: 'Pricing' } },
  { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy Policy' } },
  { path: 'terms', component: TermsComponent, data: { title: 'Terms and Conditions' } },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule), data: { title: 'Account' } },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent, data: { title: 'Confirm Email' } },
  { path: 'auth/reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
