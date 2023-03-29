import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export default [
  { path: '', component: HomeComponent },
  { path: 'account', loadChildren: () => import('./account/routes'), data: { title: 'Account' } },
  {
    path: 'auth/confirm-email',
    loadComponent: () => import('./auth/confirm-email.component').then(m => m.ConfirmEmailComponent),
    data: { title: 'Confirm Email' }
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./auth/reset-password.component').then(m => m.ResetPasswordComponent),
    data: { title: 'Reset Password' }
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    data: { title: 'Contact' }
  },
  {
    path: 'cookies',
    loadComponent: () => import('./cookies/cookies.component').then(m => m.CookiesComponent),
    data: { title: 'Cookie Policy' }
  },
  { path: 'docs', pathMatch: 'full', redirectTo: 'docs/get_started' },
  { path: 'docs', loadChildren: () => import('./docs/routes'), data: { title: '${toTitle(file)} - Docs' } },
  {
    path: 'download',
    loadComponent: () => import('./download/download.component').then(m => m.DownloadComponent),
    data: { title: 'Download' }
  },
  {
    path: 'eula',
    loadComponent: () => import('./eula/eula.component').then(m => m.EulaComponent),
    data: { title: 'End User License Agreement' }
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent),
    data: { title: 'Frequently Asked Questions' }
  },
  {
    path: 'features',
    loadComponent: () => import('./features/features.component').then(m => m.FeaturesComponent),
    data: { title: 'Features' }
  },
  {
    path: 'playground',
    loadComponent: () => import('./playground/playground.component').then(m => m.PlaygroundComponent),
    data: { title: 'Playground' }
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy.component').then(m => m.PrivacyComponent),
    data: { title: 'Privacy Policy' }
  },
  {
    path: 'refund-policy',
    loadComponent: () => import('./refund-policy/refund-policy.component').then(m => m.RefundPolicyComponent),
    data: { title: 'Refund Policy' }
  },
  {
    path: 'terms',
    loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent),
    data: { title: 'Terms and Conditions' }
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found.component').then(m => m.PageNotFoundComponent),
    data: { title: 'Page Not Found' }
  }
] as Routes;
