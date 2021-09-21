import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { RecordSave } from 'src/app/state/records/records.actions';
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
  tableRecordEndPoint: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>
  ) {
    this.origin = environment.beOrigin;
    this.tableRecordEndPoint = environment.beTableRecordEndPoint;
  }

  ngOnInit(): void {
    this.initializeContent();
  }

  initializeContent() {
    // debugger;
    this.content = this.data;
    this.modifiedContent = JSON.parse(JSON.stringify(this.content));

    // this.dialogRef?.afterClosed()?.subscribe(result => {
    //   // debugger;
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  submit() {
    // debugger;
    const endPoint = `${this.origin}${this.tableRecordEndPoint}`;
    const record = this.content.details;
    const actionType = 'update';
    console.log('confirmed');
    this.dialogRef.close('submitBtn');
    this.store.dispatch(new RecordSave({ endPoint, record, actionType }));
  }

  close() {
    console.log('closed');
    this.dialogRef.close('closeBtn');
  }

  confirmChanges() {
    // debugger;
    this.content = JSON.parse(JSON.stringify(this.modifiedContent));
  }

  cancelChanges() {
    // debugger;
    this.modifiedContent = JSON.parse(JSON.stringify(this.content));
  }


}
