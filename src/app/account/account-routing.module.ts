import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailLoginComponent } from './email/email-login.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { LoginComponent } from './login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'email/login', component: EmailLoginComponent, data: { title: 'Login' } },
  { path: 'email/register', component: EmailRegisterComponent, data: { title: 'Register' } },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { title: 'Unauthorized' } },
  { path: '', component: ManageAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
