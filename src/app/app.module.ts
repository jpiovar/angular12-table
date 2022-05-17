import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from './shared/shared.module';

import { MaterialModule } from './material.module';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { environment } from 'src/environments/environment.prod';

import { StoreRouterConnectingModule, routerReducer, RouterStateSerializer, NavigationActionTiming } from '@ngrx/router-store';
import { CustomSerializer, MergedRouterStateSerializer } from './shared/utils/routerStateSerializer';


import { reducer as spinner } from './state/spinner/spinner.reducer';
import { reducer as toastr } from './state/toastr/toastr.reducer';
import { reducer as records } from './state/records/records.reducer';
import { reducer as user } from './state/user/user.reducer';
import { reducer as logs } from './state/logs/logs.reducer';
import { reducer as recordsBase } from './state/records-base/records-base.reducer';
import { reducer as tables } from './state/tables/tables.reducer';
import { reducer as exportState } from './state/export/export.reducer';
import { reducer as recordsBaseExtended } from './state/records-base-extended/records-base-extended.reducer';

import { RecordsEffects } from './state/records/records.effects';
import { LogsEffects } from './state/logs/logs.effects';
import { RecordsBaseEffects } from './state/records-base/records-base.effects';
import { RecordsBaseExtendedEffects } from './state/records-base-extended/records-base-extended.effects';

import { AppState } from './state';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: environment.cloudUrl + '/' + environment.tenantId,
      redirectUri: environment.redirectUrl
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: isIE,
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']); // Prod environment. Uncomment to use.
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    MsalModule,
    TranslateModule.forRoot({
      defaultLanguage: 'sk',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
    StoreModule.forRoot({
      router: routerReducer,
      spinner,
      toastr,
      records,
      user,
      logs,
      recordsBase,
      tables,
      exportState,
      recordsBaseExtended
    }),
    EffectsModule.forRoot([
      RecordsEffects,
      LogsEffects,
      RecordsBaseEffects,
      RecordsBaseExtendedEffects
    ]),
    StoreDevtoolsModule.instrument({
      name: 'NgRx tracker state', logOnly: environment.production
    }),
    StoreRouterConnectingModule.forRoot({
      // serializer: CustomSerializer,         // contains router: { state: { url, params, queryParams }, navigationId }
      serializer: MergedRouterStateSerializer, // contains router: { state: { url, params, queryParams, data }, navigationId }
      navigationActionTiming: NavigationActionTiming.PostActivation
    }),
    NgbModule,
    MaterialModule
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private store: Store<AppState>) {
    console.log('App Module initialized');
  }
}
