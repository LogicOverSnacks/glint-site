import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { ContactComponent } from './contact/contact.component';
import { DownloadComponent } from './download/download.component';
import { EulaComponent } from './eula/eula.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyComponent } from './privacy/privacy.component';
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
    MatToolbarModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([AuthState, ReleasesState], {
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
    DownloadComponent,
    EulaComponent,
    FaqComponent,
    HomeComponent,
    PageNotFoundComponent,
    PlaygroundComponent,
    PricingComponent,
    PrivacyComponent,
    ResetPasswordComponent,
    TermsComponent
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
