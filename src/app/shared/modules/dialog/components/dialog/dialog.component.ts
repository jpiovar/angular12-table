import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
// import { RecordSave } from 'src/app/state/records/records.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  content: any;
  modifiedContent: any;
  origin: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private datePipe: DatePipe
  ) {
    dialogRef.disableClose = true;
    this.origin = environment.beOrigin;
  }

  ngOnInit(): void {
    this.initializeContent();
  }

  initializeContent() {
    // debugger;
    this.content = this.data;

    if (this.content?.type === 'changeLog') {
      this.dialogRef.updateSize(`100vw`);
    }

    console.log(this.content);

    // this.modifiedContent = JSON.parse(JSON.stringify(this.content));

    this.dialogRef?.afterClosed()?.subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
    });
  }

  // submit() {
  // //   // debugger;
  // //   const endPoint = `${this.origin}${this.tableRecordEndPoint}`;
  // //   const record = this.content.details;
  // //   const actionType = 'update';
  // //   console.log('confirmed');
  // //   this.dialogRef.close('submitBtn');
  // //   this.store.dispatch(new RecordSave({ endPoint, record, actionType }));
  // }

  close() {
    console.log('closed');
    this.dialogRef.close('closeBtn');
  }

  // confirmChanges() {
  //   // debugger;
  //   this.content = JSON.parse(JSON.stringify(this.modifiedContent));
  // }

  // cancelChanges() {
  //   // debugger;
  //   this.modifiedContent = JSON.parse(JSON.stringify(this.content));
  // }


  itemChanged(arr: any[], colName: string): boolean {
    let res = false;
    if (arr?.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.colName === colName) {
          res = true;
          break;
        }
      }
    }
    return res;
  }

  currentValue(arr: any[], colName: string): string {
    let res = '';
    if (arr?.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.colName === colName) {
          res = arr[i].newValue;
          break;
        }
      }
    }
    return res;
  }

  dateFormat(date: string): string {
    debugger;
    return this.datePipe?.transform(date,'dd.MM.yyyy');
  }

}
