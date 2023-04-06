import { PlatformLocation } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, UrlHandlingStrategy, withInMemoryScrolling } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app/app.component';
import { PreserveQueryParamsUrlHandlingStrategy } from './app/preserve-query-params-url-handling-strategy';
import routes from './app/routes';
import { AuthState } from './app/state/auth.state';
import { migrations } from './app/state/migrations';
import { ReleasesState } from './app/state/releases.state';
import { environment } from './environments/environment';


if (environment.production) enableProdMode();

bootstrapApplication(
  AppComponent,
  {
    providers: [
      provideAnimations(),
      provideHttpClient(),
      provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
      importProvidersFrom(
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
        })
      ),
      {
        provide: UrlHandlingStrategy,
        deps: [PlatformLocation],
        useFactory: (platformLocation: PlatformLocation) => new PreserveQueryParamsUrlHandlingStrategy(platformLocation)
      }
    ]
  }
).catch(console.error);
