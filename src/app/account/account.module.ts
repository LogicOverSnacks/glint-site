import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { EmailLoginComponent } from './email/email-login.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { LoginComponent } from './login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    MatTooltipModule,

    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    EmailLoginComponent,
    EmailRegisterComponent,
    LoginComponent,
    ManageAccountComponent,
    UnauthorizedComponent
  ]
})
export class AccountModule {}
