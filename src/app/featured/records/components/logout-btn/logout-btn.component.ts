import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/state';
import { UserStoreData } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-logout-btn',
  templateUrl: './logout-btn.component.html',
  styleUrls: ['./logout-btn.component.scss']
})
export class LogoutBtnComponent implements OnInit {
  subscription: Subscription = new Subscription();

  tableExtendedStatus: string = 'init';

  constructor(
    private msalService: MsalService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('tables')
        // .pipe(last())
        .subscribe((res: any) => {
          debugger;
          if (res?.tableExtended) {
            this.tableExtendedStatus = res?.tableExtended;
          }

        })
    );
  }

  logout() {
    debugger;
    if (this.tableExtendedStatus !== 'inprogress') {
      this.store.dispatch(new UserStoreData(null));
      this.msalService.logout();
    } else {
      debugger;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
