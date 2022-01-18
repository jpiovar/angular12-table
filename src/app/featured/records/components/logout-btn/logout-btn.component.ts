import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/shared/modules/dialog/components/dialog/dialog.component';
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

  dialogRefLogoutModal: MatDialogRef<any>;

  dialogAction: string = '';

  constructor(
    private msalService: MsalService,
    private store: Store<AppState>,
    public dialog: MatDialog
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
      this.openLogoutDialog();
    }
  }

  openLogoutDialog() {
    debugger;
    const id = 'logout-main';
    this.dialogAction = '';
    this.dialogRefLogoutModal = this.dialog.open(DialogComponent, {
      panelClass: 'logout-dialog-class',
      id: `logout-dialog-id-${id}`,
      width: '800px',
      height: 'auto',
      // minHeight: '500px',
      data: {
        title: 'Logout dialog',
        type: 'logout',
        mode: 'view'
      }
    });

    this.dialogRefLogoutModal.beforeClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;

    });

    this.dialogRefLogoutModal.afterClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
