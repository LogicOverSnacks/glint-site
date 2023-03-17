import { LayoutModule } from '@angular/cdk/layout';
import { PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlHandlingStrategy } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { ContactComponent } from './contact/contact.component';
import { CookieBannerComponent } from './cookie-banner.component';
import { CookiesComponent } from './cookies/cookies.component';
import { DownloadComponent } from './download/download.component';
import { EulaComponent } from './eula/eula.component';
import { FaqComponent } from './faq/faq.component';
import { FeaturesComponent } from './features/features.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PreserveQueryParamsUrlHandlingStrategy } from './preserve-query-params-url-handling-strategy';
import { PrivacyComponent } from './privacy/privacy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { SharedModule } from './shared/shared.module';
import { AuthState } from './state/auth.state';
import { migrations } from './state/migrations';
import { ReleasesState } from './state/releases.state';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([AuthState, ReleasesState], {
      compatibility: {
        strictContentSecurityPolicy: true
      },
      developmentMode: !environment.production,
      selectorOptions: {
        injectContainerState: false,
        suppressErrors: false
      }
    }),
    NgxsStoragePluginModule.forRoot({ key: ['auth'], migrations: migrations }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),

    AppRoutingModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    ConfirmEmailComponent,
    ContactComponent,
    CookieBannerComponent,
    CookiesComponent,
    DownloadComponent,
    EulaComponent,
    FaqComponent,
    FeaturesComponent,
    HomeComponent,
    PageNotFoundComponent,
    PlaygroundComponent,
    PrivacyComponent,
    RefundPolicyComponent,
    ResetPasswordComponent,
    TermsComponent
  ],
  providers: [
    Title,
    {
      provide: UrlHandlingStrategy,
      deps: [PlatformLocation],
      useFactory: (platformLocation: PlatformLocation) => new PreserveQueryParamsUrlHandlingStrategy(platformLocation)
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
