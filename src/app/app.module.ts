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

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { environment } from 'src/environments/environment.prod';

import { StoreRouterConnectingModule, routerReducer, RouterStateSerializer, NavigationActionTiming } from '@ngrx/router-store';
import { CustomSerializer, MergedRouterStateSerializer } from './shared/utils/routerStateSerializer';


import { reducer as spinner } from './state/spinner/spinner.reducer';
import { reducer as toastr } from './state/toastr/toastr.reducer';
import { reducer as records } from './state/records/records.reducer';

import { RecordsEffects } from './state/records/records.effects';

import { AppState } from './state';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
      records
    }),
    EffectsModule.forRoot([
      RecordsEffects
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private store: Store<AppState>) {
    console.log('App Module initialized');
  }
}
