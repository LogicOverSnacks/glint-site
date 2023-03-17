import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { PromoLoginComponent } from './promo-login.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    MatCardModule,
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
    PromoLoginComponent,
    ReferralsComponent,
    UnauthorizedComponent
  ]
})
export class AccountModule {}
