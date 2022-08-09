import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Title } from '@angular/platform-browser';
// import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
// import { HttpBaseService } from './core/services/http.base.service';
import { AppState } from './state';
import { StartSpinner, StopSpinner } from './state/spinner/spinner.actions';

import * as plantandgo from '@plantandgo/helpers';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { UserStoreData } from './state/user/user.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'frontend';
  openedSidenav: boolean = false;
  subscription: Subscription = new Subscription();
  languageParam = { value: 'intro' };
  translation: any;
  tt: string = '';

  constructor(
    private store: Store<AppState>,
    public translate: TranslateService,
    private msalService: MsalService,
    private httpClient: HttpClient,
    // private titleService: Title,
    private router: Router,
    // private httpBase: HttpBaseService,
  ) {
    console.log('process.env ', process.env.FOO);
    console.log('current browser is Explorer ', plantandgo?.isExplorer());
    translate?.addLangs(['sk', 'en']);
    translate?.setDefaultLang('sk');
    const browserLang = translate?.getBrowserLang();
    translate?.use(browserLang.match(/sk/) ? browserLang : 'sk');

    this.translationSubscribe();

  }

  translateLanguageTo(lang: string) {
    debugger;
    this.translate.use(lang);
    // this.tt = this.translate.instant('HOME.main');
    this.translate.get(['HOME.main']).subscribe(res => {
      this.tt = res['HOME.main'];
    });
  }



  getAccessToken() {
    // debugger;
    const request = {
      scopes: [
        '.default'
        // 'user.read', 'mail.read'
      ]
    };

    this.msalService.instance.acquireTokenSilent(request).then(tokenResponse => {
      // Do something with the tokenResponse
      // debugger;
      this.storeAccessToken(tokenResponse);
    }).catch(error => {
      // // debugger;
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return this.msalService.instance.acquireTokenRedirect(request);
      }
    });
  }

  storeAccessToken(res) {
    // // debugger;
    this.store.dispatch(new UserStoreData(res));
  }

  ngOnInit(): void {
    // debugger;
    this.store.dispatch(new StartSpinner());
    this.msalService.instance.handleRedirectPromise().then(res => {
      // debugger;
      this.store.dispatch(new StopSpinner());
      if (res?.account) {
        this.msalService.instance.setActiveAccount(res.account);
        // if (this.isLoggedIn()) {
        //   this.router.navigate(['/records']);
        // } else {
        //   this.router.navigate(['/login']);
        // }
      }

      if (this.isLoggedIn()) {
        this.getAccessToken();
        this.router.navigate(['/records']);
      } else {
        this.router.navigate(['/login']);
      }
    });



  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  // login() {
  //   this.msalService.loginRedirect();
  //   // this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
  //   //   this.msalService.instance.setActiveAccount(response.account);
  //   // });
  // }

  // logout() {
  //   this.store.dispatch(new UserStoreData(null));
  //   this.msalService.logout();
  // }

  translationSubscribe() {
    // currently just for example of usage
    this.subscription.add(
      this.translate?.get('MAIN.APP-NAME', this.languageParam).subscribe((res: string) => {
        debugger;
        console.log('app MAIN.APP-NAME', res);
      })
    );

    this.subscription.add(
      this.translate?.get('HOME').subscribe(obj => {
        debugger;
        this.translation = obj;
        console.log('app HOME', obj);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
