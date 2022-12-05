import { NgModule } from '@angular/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
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

@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
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
    InvalidLoginComponent,
    LoginComponent,
    ManageAccountComponent,
    OAuthLoginComponent,
    UnauthorizedComponent
  ]
})
export class AccountModule {}
