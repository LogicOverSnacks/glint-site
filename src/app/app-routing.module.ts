import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { ContactComponent } from './contact/contact.component';
import { CookiesComponent } from './cookies/cookies.component';
import { DownloadComponent } from './download/download.component';
import { EulaComponent } from './eula/eula.component';
import { FaqComponent } from './faq/faq.component';
import { FeaturesComponent } from './features/features.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule), data: { title: 'Account' } },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent, data: { title: 'Confirm Email' } },
  { path: 'auth/reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
  { path: 'contact', component: ContactComponent, data: { title: 'Contact' } },
  { path: 'cookies', component: CookiesComponent, data: { title: 'Cookie Policy' } },
  { path: 'docs', pathMatch: 'full', redirectTo: 'docs/get_started' },
  { path: 'docs', loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule), data: { title: '${toTitle(file)} - Docs' } },
  { path: 'download', component: DownloadComponent, data: { title: 'Download' } },
  { path: 'eula', component: EulaComponent, data: { title: 'End User License Agreement' } },
  { path: 'faq', component: FaqComponent, data: { title: 'Frequently Asked Questions' } },
  { path: 'features', component: FeaturesComponent, data: { title: 'Features' } },
  { path: 'playground', component: PlaygroundComponent, data: { title: 'Playground' } },
  { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy Policy' } },
  { path: 'terms', component: TermsComponent, data: { title: 'Terms and Conditions' } },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
