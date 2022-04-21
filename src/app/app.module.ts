import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.components';
import { DocsComponent } from './docs/docs.component';
import { DownloadComponent } from './download/download.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PlaygroundComponent } from './playground/playground.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,

    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    DocsComponent,
    DownloadComponent,
    HomeComponent,
    PageNotFoundComponent,
    PlaygroundComponent
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
