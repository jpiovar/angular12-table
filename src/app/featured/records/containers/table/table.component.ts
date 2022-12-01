import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { indexOf } from 'lodash';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/state';
import { StopSpinner } from 'src/app/state/spinner/spinner.actions';
import { availableRoles, userRoles } from 'src/assets/roles/definitions';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  languageParam = { value: 'intro' };
  translation: any;
  tt: string = '';
  userAccount: any;
  mainTableVisible: boolean = false;

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>
  ) {
    this.translationSubscribe();
    this.loadUserAccount();
  }

  ngOnInit(): void { }

  loadUserAccount() {
    this.subscription.add(
      this.store.select('user').subscribe((res: any) => {

        this.userAccount = res?.account?.idTokenClaims;
        if (this.userAccount?.roles?.length > 0) {
          console.log('user has roles ', this.userAccount?.roles);
          for (let i = 0; i < this.userAccount?.roles?.length; i++) {
            if (availableRoles.indexOf(this.userAccount?.roles[i]) > -1) {
              console.log('table container user roles subscription ', this.userAccount?.roles[i], ' fits in availableRoles');
              // if (this.userAccount?.roles[i] === userRoles.Readers.value) {
              //   this.mainTableVisible = true;
              // }
            }
          }
          if (this.userAccount?.roles.indexOf(userRoles.Readers.value) > -1) {
            this.mainTableVisible = true;
          }
        }

        if (!this.mainTableVisible) {
          this.store.dispatch(new StopSpinner());
        }
      })
    );
  }

  translationSubscribe() {
    // currently just for example of usage
    // this.subscription.add(
    //   this.translate?.get('MAIN.APP-NAME', this.languageParam).subscribe((res: string) => {
    //     debugger;
    //     console.log('TableComponent', res);
    //   })
    // );

    this.subscription.add(
      this.translate?.get('RECORDS').subscribe(obj => {
        debugger;
        this.translation = obj;
        console.log('TableComponent RECORDS', obj);
      })
    );
  }

  translateLanguageTo(lang: string) {
    debugger;
    this.translate.use(lang);
    // this.tt = this.translate.instant('HOME.main');
    this.translate.get(['RECORDS']).subscribe(res => {
      // debugger;
      // this.tt = res['RECORDS'].main;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
