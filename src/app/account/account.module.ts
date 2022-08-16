import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { EmailChangePasswordComponent } from './email/email-change-password.component';
import { EmailLoginComponent } from './email/email-login.component';
import { EmailLostPasswordComponent } from './email/email-lost-password.component';
import { EmailNotConfirmedComponent } from './email/email-not-confirmed.component';
import { EmailRegisterComponent } from './email/email-register.component';
import { GithubInvalidComponent } from './github/github-invalid.component';
import { GithubLoginComponent } from './github/github-login.component';
import { LoginComponent } from './login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,

    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    EmailChangePasswordComponent,
    EmailLoginComponent,
    EmailLostPasswordComponent,
    EmailNotConfirmedComponent,
    EmailRegisterComponent,
    GithubInvalidComponent,
    GithubLoginComponent,
    LoginComponent,
    ManageAccountComponent,
    UnauthorizedComponent
  ]
})
export class AccountModule {}
