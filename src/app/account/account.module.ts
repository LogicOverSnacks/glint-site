import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { EmailLoginComponent } from './email/email-login.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    EmailLoginComponent,
    EmailRegisterComponent,
    ManageAccountComponent,
    UnauthorizedComponent
  ]
})
export class AccountModule {}
