import { LayoutModule } from '@angular/cdk/layout';
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
import { FeaturesComponent } from './features/features.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
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
    FeaturesComponent,
    HomeComponent,
    PageNotFoundComponent,
    PlaygroundComponent,
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
