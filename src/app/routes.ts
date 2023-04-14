import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export default [
  { path: '', component: HomeComponent },
  { path: 'account', loadChildren: () => import('./account/routes'), data: { title: $localize`Account` } },
  {
    path: 'auth/confirm-email',
    loadComponent: () => import('./auth/confirm-email.component').then(m => m.ConfirmEmailComponent),
    data: { title: $localize`Confirm Email` }
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./auth/reset-password.component').then(m => m.ResetPasswordComponent),
    data: { title: $localize`Reset Password` }
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    data: { title: $localize`Contact` }
  },
  {
    path: 'cookies',
    loadComponent: () => import('./cookies/cookies.component').then(m => m.CookiesComponent),
    data: { title: $localize`Cookie Policy` }
  },
  { path: 'docs', pathMatch: 'full', redirectTo: 'docs/get_started' },
  { path: 'docs', loadChildren: () => import('./docs/routes'), data: { title: `\${toTitle(file)} - ${$localize`Docs`}` } },
  {
    path: 'download',
    loadComponent: () => import('./download/download.component').then(m => m.DownloadComponent),
    data: { title: $localize`Download` }
  },
  {
    path: 'eula',
    loadComponent: () => import('./eula/eula.component').then(m => m.EulaComponent),
    data: { title: $localize`End User License Agreement` }
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent),
    data: { title: $localize`Frequently Asked Questions` }
  },
  {
    path: 'features',
    loadComponent: () => import('./features/features.component').then(m => m.FeaturesComponent),
    data: { title: $localize`Features` }
  },
  {
    path: 'playground',
    loadComponent: () => import('./playground/playground.component').then(m => m.PlaygroundComponent),
    data: { title: $localize`Playground` }
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy.component').then(m => m.PrivacyComponent),
    data: { title: $localize`Privacy Policy` }
  },
  {
    path: 'refund-policy',
    loadComponent: () => import('./refund-policy/refund-policy.component').then(m => m.RefundPolicyComponent),
    data: { title: $localize`Refund Policy` }
  },
  {
    path: 'terms',
    loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent),
    data: { title: $localize`Terms and Conditions` }
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found.component').then(m => m.PageNotFoundComponent),
    data: { title: $localize`Page Not Found` }
  }
] as Routes;
