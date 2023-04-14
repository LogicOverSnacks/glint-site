import { Routes } from '@angular/router';

import { EmailChangePasswordComponent } from './email/email-change-password.component';
import { EmailLoginComponent } from './email/email-login.component';
import { EmailLostPasswordComponent } from './email/email-lost-password.component';
import { EmailNotConfirmedComponent } from './email/email-not-confirmed.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { InvalidLoginComponent } from './invalid-login.component';
import { LoginComponent } from './login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { OAuthLoginComponent } from './oauth-login.component';
import { PaymentSuccessComponent } from './payment-success.component';
import { PromoLoginComponent } from './promo-login.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { UnauthorizedComponent } from './unauthorized.component';

export default [
  { path: 'email/change-password', component: EmailChangePasswordComponent, data: { title: $localize`Change Password` } },
  { path: 'email/login', component: EmailLoginComponent, data: { title: $localize`Login` } },
  { path: 'email/lost-password', component: EmailLostPasswordComponent, data: { title: $localize`Reset Password` } },
  { path: 'email/not-confirmed', component: EmailNotConfirmedComponent, data: { title: $localize`Email Not Confirmed` } },
  { path: 'email/register', component: EmailRegisterComponent, data: { title: $localize`Register` } },
  { path: 'login', component: LoginComponent, data: { title: $localize`Login` } },
  { path: 'login/:type', component: OAuthLoginComponent, data: { title: $localize`Login with \${type}` } },
  { path: 'invalid/:type', component: InvalidLoginComponent, data: { title: $localize`Invalid Login` } },
  { path: 'payment-success', component: PaymentSuccessComponent, data: { title: $localize`Payment Succeeded` } },
  { path: 'referrals', component: ReferralsComponent, data: { title: $localize`Referral Account` } },
  { path: 'promo-login', component: PromoLoginComponent, data: { title: $localize`Register` } },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { title: $localize`Unauthorized` } },
  { path: '', component: ManageAccountComponent }
] as Routes;
