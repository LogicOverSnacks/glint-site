import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailChangePasswordComponent } from './email/email-change-password.component';
import { EmailLoginComponent } from './email/email-login.component';
import { EmailLostPasswordComponent } from './email/email-lost-password.component';
import { EmailNotConfirmedComponent } from './email/email-not-confirmed.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { GithubInvalidComponent } from './github/github-invalid.component';
import { GithubLoginComponent } from './github/github-login.component';
import { GoogleInvalidComponent } from './google/google-invalid.component';
import { GoogleLoginComponent } from './google/google-login.component';
import { LoginComponent } from './login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'email/change-password', component: EmailChangePasswordComponent, data: { title: 'Change Password' } },
  { path: 'email/login', component: EmailLoginComponent, data: { title: 'Login' } },
  { path: 'email/lost-password', component: EmailLostPasswordComponent, data: { title: 'Reset Password' } },
  { path: 'email/not-confirmed', component: EmailNotConfirmedComponent, data: { title: 'Email Not Confirmed' } },
  { path: 'email/register', component: EmailRegisterComponent, data: { title: 'Register' } },
  { path: 'github/login', component: GithubLoginComponent, data: { title: 'Login with GitHub' } },
  { path: 'github/invalid', component: GithubInvalidComponent, data: { title: 'Invalid Login' } },
  { path: 'google/login', component: GoogleLoginComponent, data: { title: 'Login with Google' } },
  { path: 'google/invalid', component: GoogleInvalidComponent, data: { title: 'Invalid Login' } },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { title: 'Unauthorized' } },
  { path: '', component: ManageAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
