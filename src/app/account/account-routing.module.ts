import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailChangePasswordComponent } from './email/email-change-password.component';
import { EmailLoginComponent } from './email/email-login.component';
import { EmailLostPasswordComponent } from './email/email-lost-password.component';
import { EmailNotConfirmedComponent } from './email/email-not-confirmed.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { InvalidLoginComponent } from './invalid-login.component';
import { LoginComponent } from './login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { OAuthLoginComponent } from './oauth-login.component';
import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'email/change-password', component: EmailChangePasswordComponent, data: { title: 'Change Password' } },
  { path: 'email/login', component: EmailLoginComponent, data: { title: 'Login' } },
  { path: 'email/lost-password', component: EmailLostPasswordComponent, data: { title: 'Reset Password' } },
  { path: 'email/not-confirmed', component: EmailNotConfirmedComponent, data: { title: 'Email Not Confirmed' } },
  { path: 'email/register', component: EmailRegisterComponent, data: { title: 'Register' } },
  { path: 'login/:type', component: OAuthLoginComponent, data: { title: 'Login with ${type}' } },
  { path: 'invalid/:type', component: InvalidLoginComponent, data: { title: 'Invalid Login' } },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { title: 'Unauthorized' } },
  { path: '', component: ManageAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
