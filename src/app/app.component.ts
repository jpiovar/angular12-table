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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'angular11-12';
  openedSidenav: boolean = false;
  subscription: Subscription = new Subscription();
  languageParam = { value: 'intro' };
  translation: any;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private msalService: MsalService,
    private httpClient: HttpClient,
    // private titleService: Title,
    private router: Router,
    // private httpBase: HttpBaseService,
  ) {
    console.log('current browser is Explorer ', plantandgo?.isExplorer());
    translate?.addLangs(['sk']);
    translate?.setDefaultLang('sk');
    const browserLang = translate?.getBrowserLang();
    translate?.use(browserLang.match(/sk/) ? browserLang : 'sk');

    this.translationSubscribe();

  }

  ngOnInit(): void {
    debugger;
    this.store.dispatch(new StartSpinner());
    this.msalService.instance.handleRedirectPromise().then(res => {
      debugger;
      this.store.dispatch(new StopSpinner());
      if (res?.account) {
        this.msalService.instance.setActiveAccount(res.account);
        this.router.navigate(['']);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  login() {
    this.msalService.loginRedirect();
    // this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
    //   this.msalService.instance.setActiveAccount(response.account);
    // });
  }

  logout() {
    this.msalService.logout();
  }

  translationSubscribe() {
    // currently just for example of usage
    this.subscription.add(
      this.translate?.get('MAIN.APP-NAME', this.languageParam).subscribe((res: string) => {
        console.log(res);
      })
    );

    this.subscription.add(
      this.translate?.get('HOME').subscribe(obj => this.translation = obj)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
