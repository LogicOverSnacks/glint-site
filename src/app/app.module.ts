import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ConfirmEmailComponent } from './auth/confirm-email.component';
import { LostPasswordComponent } from './auth/lost-password.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { DocsComponent } from './docs/docs.component';
import { DownloadComponent } from './download/download.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ContainerComponent } from './shared/container.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,

    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    ConfirmEmailComponent,
    ContainerComponent,
    DocsComponent,
    DownloadComponent,
    FaqComponent,
    HomeComponent,
    LostPasswordComponent,
    PageNotFoundComponent,
    PlaygroundComponent,
    ResetPasswordComponent
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
