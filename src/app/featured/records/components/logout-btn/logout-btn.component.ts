import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { UserStoreData } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-logout-btn',
  templateUrl: './logout-btn.component.html',
  styleUrls: ['./logout-btn.component.scss']
})
export class LogoutBtnComponent implements OnInit {

  constructor(
    private msalService: MsalService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.store.dispatch(new UserStoreData(null));
    this.msalService.logout();
  }

}
