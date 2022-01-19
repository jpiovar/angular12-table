// import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

// @Component({
//   selector: 'app-table-base-extended',
//   templateUrl: './table-base-extended.component.html',
//   styleUrls: ['./table-base-extended.component.scss']
// })
// export class TableBaseExtendedComponent implements OnInit, OnChanges {
//   @Input() itemRecordNew: any = {};

//   constructor() { }

//   ngOnInit(): void {
//   }

//   ngOnChanges(): void { }

// }


import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription, zip } from 'rxjs';

import * as _ from 'lodash';

import { compareValues, getIndexBasedId, getItemBasedId, isoStringtoNgbDateStruct, ngbDateStructToIsoString } from 'src/app/shared/utils/helper';
import { AppState } from 'src/app/state';
import {
  RecordsAddNew,
  // ChangeLogLoad, MetaLoad, MetaLocalSave,
  RecordsDelete, RecordsLoad, RecordsSave
} from 'src/app/state/records/records.actions';
import { environment } from 'src/environments/environment';
import { compare } from 'natural-orderby';
import { DialogComponent } from 'src/app/shared/modules/dialog/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { HttpBaseService } from 'src/app/core/services/http.base.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StartSpinner, StopSpinner } from 'src/app/state/spinner/spinner.actions';
import { UserStoreData } from 'src/app/state/user/user.actions';
import { MsalService } from '@azure/msal-angular';
import { LogsLoad } from 'src/app/state/logs/logs.actions';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DialogStepperComponent } from 'src/app/shared/modules/dialog/components/dialog-stepper/dialog-stepper.component';



@Component({
  selector: 'app-table-base-extended',
  templateUrl: './table-base-extended.component.html',
  styleUrls: ['./table-base-extended.component.scss']
})

export class TableBaseExtendedComponent implements OnInit, OnChanges, OnDestroy {
  subscription: Subscription = new Subscription();

  @Input() submitCall: Subject<any>;

  @Input() newRecords: any[] = [];

  @Output() submitRecordsEvent = new EventEmitter<any>();

  tableDataEndPoint: string;
  origin: string;
  currentUrl: string = '';
  originalRecords: any[];
  records: any[];

  user: any;


  recordsDiffArrObj: any = null;

  tableMode: 'init' | 'load' | 'save' | 'edit' | 'read' | 'remove' | 'log' | '' = '';


  date: any = new Date();
  // model1: NgbDateStruct = { day: this.date.getUTCDate(), month: this.date.getUTCMonth()+1, year: this.date.getUTCFullYear()};
  model1: NgbDateStruct = isoStringtoNgbDateStruct('2020-01-10T00:00:00');

  minDate = { year: 2017, month: 1, day: 1 };
  maxDate = { year: 2027, month: 12, day: 1 };

  ratingOptions: string[] = ['A', 'B', 'C', 'D', 'E'];

  changeDate(event) {
    console.log(event);
  }

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private httpBase: HttpBaseService,
    private httpClient: HttpClient,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar
  ) {
    this.origin = environment.beOrigin;
    this.tableDataEndPoint = environment.beTableDataEndPoint;
    this.tableMode = 'init';
  }

  ngOnInit(): void {
    // this.triggerTableLoad();
    // this.eventsSubscription = this.events.subscribe(() => {
    //   console.log('submitt new record');
    // });

    this.subscription.add(
      this.submitCall.subscribe(res => {
        debugger;
        console.log('submitCall executed', res);
        this.triggerCheckChangesAndSave();
      })
    );

    this.subscription.add(
      this.store.select('user').subscribe((res: any) => {
        debugger;
        if (res) {
          debugger;
          this.user = res;
        }
      })
    );
  }

  ngOnChanges(): void {
    // debugger;
    // this.newRecords;
    this.triggerTableLoad();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // createAndExecuteUrl() {
  //   debugger;
  //   const origin = `${this.origin}`;
  //   const endPoint = `${this.tableDataEndPoint}`;
  //   // const statusLike = this.toggleBtnState ? `status_like=${this.toggleBtnState}` : '';
  //   const statusLike = this.toggleBtnState === 'active' ? `status_ne=inactive` : `status_ne=active`;
  //   const q = this.searchText ? `&q=${this.searchText}` : '';
  //   const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
  //   const order = this.direction ? `&_order=${this.direction}` : '';
  //   const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
  //   const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

  //   const url = `${origin}${endPoint}?${statusLike}${q}${sort}${order}${page}${limit}`;
  //   this.currentUrl = url;
  //   this.store.dispatch(new RecordsLoad(url));
  // }

  initializeStructure(records: any[]) {
    const d = new Date(); // today date
    const dtext = d.toISOString();
    for (let i = 0; i < records?.length; i++) {
      records[i]['manualny_rating'] = '';
      records[i]['od'] = dtext;
      records[i]['do'] = dtext;
      records[i]['poznamka'] = '';
    }
  }


  triggerTableLoad(): void {
    debugger;
    let newRecords = JSON.parse(JSON.stringify(this.newRecords));
    this.tableMode = 'load';
    // this.store.dispatch(new StartSpinner());
    this.initializeStructure(newRecords);
    this.originalRecords = this.setDatePickersToNgbStruct(JSON.parse(JSON.stringify(newRecords)), ['od', 'do']);
    this.records = JSON.parse(JSON.stringify(this.originalRecords));
    // this.createAndExecuteUrl();
  }

  setDatePickersToNgbStruct(arrObj: any[], props: string[]) {
    const arr = JSON.parse(JSON.stringify(arrObj));
    for (let j = 0; j < props.length; j++) {
      const currentProp = props[j];
      for (let i = 0; i < arr?.length; i++) {
        if (arr[i][currentProp]) {
          arr[i][currentProp] = isoStringtoNgbDateStruct(arr[i][currentProp]);
        }
        // else {
        //   const d = new Date(); // today date
        //   const dtext = d.toISOString();
        //   arr[i][currentProp] = isoStringtoNgbDateStruct(dtext);
        // }
      }
    }
    return arr;
  }

  getSetArrPropertyByValue(records: any, propertyName: string, propertyValue: any) {
    debugger;
    const res = JSON.parse(JSON.stringify(records));
    for (let index = 0; index < res.length; index++) {
      if (propertyValue && propertyValue.indexOf('property_') > -1 && res[index].hasOwnProperty(propertyValue.replace('property_',''))) {
        res[index][propertyName] = res[index][propertyValue.replace('property_','')];
      } else if (propertyValue === 'remove') {
        delete res[index][propertyName];
      } else {
        res[index][propertyName] = propertyValue;
      }
    }
    return res;
  }

  getSetPropertyByValue(record: any, propertyName: string, propertyValue: any) {
    const res = JSON.parse(JSON.stringify(record));
    if (propertyValue === 'remove') {
      delete res[propertyName];
    } else {
      res[propertyName] = propertyValue;
    }
    return res;
  }


  triggerCheckChangesAndSave() {
    debugger;
    for(let i=0; i<this.records.length; i++) {
      this.onInputChange('manualny_rating', this.records[i]);
      this.onInputChange('od', this.records[i]);
      this.onInputChange('do', this.records[i]);
      this.onInputChange('poznamka', this.records[i]);
    }

    if (!this.getRecordsDiffArrObjError(this.recordsDiffArrObj)) {
      this.saveChanges();
    }

  }


  onInputChange(colname: string, item: any) {
    debugger;
    // const itemId = this.records[index]?.id;
    const itemId = item?.id;
    const index = getIndexBasedId(this.records, itemId);

    const recordItemChanged = this.recordsItemChanged(this.records[index], this.originalRecords[index]);
    if (recordItemChanged) {
      if (this.recordsDiffArrObj === null) {
        this.recordsDiffArrObj = {};
      }
      const temp = JSON.parse(JSON.stringify((this.recordsDiffArrObj)));
      temp[itemId] = this.records[index];
      this.recordsDiffArrObj = { ...this.recordsDiffArrObj, ...temp };

    } else {
      this.recordsDiffArrObj && delete this.recordsDiffArrObj[itemId];
    }
    if (JSON.stringify(this.recordsDiffArrObj) === '{}') {
      this.recordsDiffArrObj = null;
    }

    if (colname) {

      if (!item[colname]) {
        item[colname + 'ErrorRequired'] = true;
      } else {
        delete item[colname + 'ErrorRequired'];
      }

      if (colname === 'od' || colname === 'do') {
        const isoDateOd = ngbDateStructToIsoString(item['od']);
        const isoDateDo = ngbDateStructToIsoString(item['do']);

        if (isoDateOd && isoDateDo && isoDateOd > isoDateDo) {
          item['ErrorInterval'] = true;
        } else {
          delete item['ErrorInterval'];
        }
      }

    }


  }


  recordsItemChanged(recordsItem, originalRecordsItem) {
    // debugger;
    // const record = this.getSetPropertyByValue(JSON.parse(JSON.stringify(recordsItem)), 'edit', false);
    // const originalRecord = this.getSetPropertyByValue(JSON.parse(JSON.stringify(originalRecordsItem)), 'edit', false);
    const record = JSON.parse(JSON.stringify(recordsItem));
    const originalRecord = JSON.parse(JSON.stringify(originalRecordsItem));
    // if (JSON.stringify(record) != JSON.stringify(originalRecord)) {
    if (_.isEqual(record, originalRecord)) {
      return false;
    }
    return true;
  }

  getRecordsDiffArrObjError(obj: any): boolean {
    // debugger;
    let res = false;
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        const keys = Object.keys(obj[i]);
        if (keys.join(',').indexOf('Error') > -1) {
          res = true;
          break;
        }
      }
    }
    return res;
  }

  saveChanges() {
    this.store.dispatch(new StartSpinner());
    debugger;
    if (this.recordsDiffArrObj) {
      // const url = `${this.origin}${this.tableDataEndPoint}`;
      // let records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'edit', 'remove');

      // let modified = {};
      // for (const key in this.recordsDiffArrObj) {
      //   if (this.recordsDiffArrObj.hasOwnProperty(key)) {
      //     modified[key] = this.getSetPropertyByValue(JSON.parse(JSON.stringify(this.recordsDiffArrObj[key])), 'edit', 'remove');

      //   }
      // }
      // // debugger;
      // records = this.setDatePickersToIsoString(records, ['od', 'do']);
      // modified = this.setDatePickersToIsoString(modified, ['od', 'do']);
      // this.store.dispatch(new RecordsSave({ endPoint: url, records, modified, currentUrl: this.currentUrl }));
      // this.recordsDiffArrObj = null;

      const d = new Date(); // today date
      const dtext = d.toISOString();
      const url = `${this.origin}${this.tableDataEndPoint}`;
      let records =JSON.parse(JSON.stringify(this.records));
      records = this.setDatePickersToIsoString(records, ['od', 'do']);
      records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'resource_id', 'property_id');
      records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'id', 'remove');
      records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'status', 'active');
      records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'datum_zmeny', dtext);
      records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'autor_zmeny', this.user?.account?.name);
      this.store.dispatch(new RecordsAddNew({ endPoint: url, records }));

      this.sendDataToParent(records);
    }
    this.store.dispatch(new StopSpinner());
  }

  setDatePickersToIsoString(arrObj: any, props: string[]) {
    const arr: any[] = JSON.parse(JSON.stringify(arrObj));
    for (let j = 0; j < props.length; j++) {
      const currentProp = props[j];

      for (const i in arr) { // accepts array and object
        if (arr.hasOwnProperty(i)) {
          arr[i][currentProp] = ngbDateStructToIsoString(arr[i][currentProp]);
        }
      }
    }
    return arr;
  }

  sendDataToParent(records: any) {
    debugger;
    this.submitRecordsEvent.emit(records);
  }

}