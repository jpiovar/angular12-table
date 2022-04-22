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

import moment from 'moment';
import * as _ from 'lodash';

import { v4 as uuidv4 } from 'uuid';

import { compareValues, getIndexBasedId, getItemBasedId, getSetPropertyByValue, getSetArrPropertyByValue, isLocalHostAndMockWay, isoStringtoNgbDateStruct, ngbDateStructToIsoString } from 'src/app/shared/utils/helper';
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
import { RecordsBaseExtendedLoad } from 'src/app/state/records-base-extended/records-base-extended.actions';



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

  sortBy: string = 'datumOd';
  direction: 'asc' | 'desc' = 'asc';
  activePage: number = 0;
  recordsPerPage: number = 1000;

  user: any;


  recordsDiffArrObj: any = null;

  tableMode: 'init' | 'load' | 'save' | 'edit' | 'read' | 'remove' | 'log' | '' = '';


  date: any = new Date();
  // model1: NgbDateStruct = { day: this.date.getUTCDate(), month: this.date.getUTCMonth()+1, year: this.date.getUTCFullYear()};
  model1: NgbDateStruct = isoStringtoNgbDateStruct('2020-01-10T00:00:00');

  minDate = { year: 2017, month: 1, day: 1 };
  maxDate = { year: 2027, month: 12, day: 1 };

  ratingOptions: string[] = ['A', 'B', 'C', 'D', 'E'];



  // opIco: string = '';
  op: string = '';
  ico: string = '';
  totalRecordsBE: number = 0;
  originalRecordsBE: any[];
  recordsBE: any[];

  currentUrlTableExtended: string = '';

  markDisabled1: any;

  markDisabled2: any;


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

    this.getCurrentUrlTableExtended();

    this.subscription.add(
      this.submitCall.subscribe(res => {
        // // debugger;
        console.log('submitCall executed', res);
        this.triggerCheckChangesAndSave();
      })
    );

    this.subscription.add(
      this.store.select('user').subscribe((res: any) => {
        // // debugger;
        if (res) {
          // // debugger;
          this.user = res;
        }
      })
    );

    this.subscription.add(
      this.store.select('recordsBaseExtended')
        // .pipe(last())
        .subscribe((res: any) => {
          // // // debugger;

          this.store.dispatch(new StopSpinner());

          if (res && !res.loading) {
            // // // debugger;
            if (res?.totalRecords > -1) {
              this.totalRecordsBE = res?.totalRecords;

            }

            if (res.data) {
              // // // debugger;
              // this.originalRecords = this.setDatePickersToNgbStruct(JSON.parse(JSON.stringify(res.data)), ['datumOd', 'datumDo']);
              this.originalRecordsBE = JSON.parse(JSON.stringify(res.data));
              this.recordsBE = JSON.parse(JSON.stringify(this.originalRecordsBE));
              // }
            }

          }


        })
    );
  }

  ngOnChanges(): void {
    // // // debugger;
    // this.newRecords;
    this.triggerTableLoad();
    this.triggerTableBaseExtendedLoad();

    this.enableFirst();
    this.enableLast();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // createAndExecuteUrl() {
  //   // // debugger;
  //   const origin = `${this.origin}`;
  //   const endPoint = `${this.tableDataEndPoint}`;
  //   // const statusLike = this.toggleBtnState ? `status_like=${this.toggleBtnState}` : '';
  //   const statusLike = this.toggleBtnState === 'ACTIVE' ? `status_ne=INACTIVE` : `status_ne=ACTIVE`;
  //   const q = this.searchText ? `&q=${this.searchText}` : '';
  //   const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
  //   const order = this.direction ? `&_order=${this.direction}` : '';
  //   const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
  //   const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

  //   const url = `${origin}${endPoint}?${statusLike}${q}${sort}${order}${page}${limit}`;
  //   this.currentUrl = url;
  //   this.store.dispatch(new RecordsLoad(url));
  // }


  enableFirst() {
    this.markDisabled1 = (date: NgbDate) => {
      return date.day > 1;
    };
  }


  enableLast() {
    this.markDisabled2 = (date: NgbDate) => {
      return (date.day < 31 && date.month == 1) ||
        (date.day < 28 && date.month == 2 && date.year % 4 !== 0) || (date.day < 29 && date.month == 2 && date.year % 4 === 0) ||
        (date.day < 31 && date.month == 3) || (date.day < 30 && date.month == 4) ||
        (date.day < 31 && date.month == 5) || (date.day < 30 && date.month == 6) ||
        (date.day < 31 && date.month == 7) || (date.day < 31 && date.month == 8) ||
        (date.day < 30 && date.month == 9) || (date.day < 31 && date.month == 10) ||
        (date.day < 30 && date.month == 11) || (date.day < 31 && date.month == 12);
    };
  }


  initializeStructure(records: any[]) {
    // debugger;
    // const d1 = new Date(); // today date
    const dtext1 = moment().startOf('month').format('YYYY-MM-DD[T]HH:mm:ss'); // d1.toISOString();
    // const d2 = new Date();
    // d2.setFullYear(new Date().getFullYear() + 1);
    const dtext2 = moment().endOf('month').add(1, 'years').format('YYYY-MM-DD[T]HH:mm:ss'); // d2.toISOString();

    const dtextNow = moment().format('YYYY-MM-DD[T]HH:mm:ss');

    for (let i = 0; i < records?.length; i++) {
      records[i]['manualnyRating'] = '';
      records[i]['datumOd'] = dtext1;
      records[i]['datumDo'] = dtext2;
      records[i]['poznamka'] = '';
      records[i]['datumPoslednejZmeny'] = dtextNow;
    }
  }


  triggerTableLoad(): void {
    // // debugger;
    const newRecords = JSON.parse(JSON.stringify(this.newRecords));
    this.tableMode = 'load';
    // this.store.dispatch(new StartSpinner());
    this.initializeStructure(newRecords);
    this.originalRecords = this.setDatePickersToNgbStruct(JSON.parse(JSON.stringify(newRecords)), ['datumOd', 'datumDo', 'datumPoslednejZmeny']);
    this.records = JSON.parse(JSON.stringify(this.originalRecords));
    // this.createAndExecuteUrl();
  }

  triggerTableBaseExtendedLoad() {
    // // debugger;
    // this.opIco = this?.newRecords[0]?.opIco;
    this.op = this?.newRecords[0]?.op;
    this.ico = this?.newRecords[0]?.ico;
    const origin = `${this.origin}`;
    const endPoint = `${this.tableDataEndPoint}`;
    // const opIco = this.opIco?.trim() ? `opIco=${this.opIco?.trim()}` : '';
    const op = this.op?.trim() ? `op=${this.op?.trim()}` : '';
    const ico = this.ico?.trim() ? `&ico=${this.ico?.trim()}` : '';
    const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    const order = this.direction ? `&_order=${this.direction}` : '';
    const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';
    const url = `${origin}${endPoint}?${op}${ico}${sort}${order}${page}${limit}`;
    this.store.dispatch(new RecordsBaseExtendedLoad(url));
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




  triggerCheckChangesAndSave() {
    // debugger;
    for (let i = 0; i < this.records.length; i++) {
      this.onInputChange('manualnyRating', this.records[i]);
      this.onInputChange('datumOd', this.records[i]);
      this.onInputChange('datumDo', this.records[i]);
      this.onInputChange('poznamka', this.records[i]);
    }

    if (!this.getRecordsDiffArrObjError(this.recordsDiffArrObj)) {
      this.saveChanges();
    }

  }


  onInputChange(colname: string, item: any) {
    // debugger;
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
      if (this.recordsDiffArrObj) {
        delete this.recordsDiffArrObj[itemId];
      }
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

      if (colname === 'datumOd' || colname === 'datumDo') {
        const isoDateOd = item[colname] && ngbDateStructToIsoString(item['datumOd']);
        const isoDateDo = item[colname] && ngbDateStructToIsoString(item['datumDo']);

        if (isoDateOd && isoDateDo && isoDateOd > isoDateDo) {
          item['ErrorInterval'] = true;
        } else {
          delete item['ErrorInterval'];
        }
      }

    }


  }


  recordsItemChanged(recordsItem, originalRecordsItem) {
    // // debugger;
    // const record = getSetPropertyByValue(JSON.parse(JSON.stringify(recordsItem)), 'edit', false);
    // const originalRecord = getSetPropertyByValue(JSON.parse(JSON.stringify(originalRecordsItem)), 'edit', false);
    const record = JSON.parse(JSON.stringify(recordsItem));
    const originalRecord = JSON.parse(JSON.stringify(originalRecordsItem));
    // if (JSON.stringify(record) != JSON.stringify(originalRecord)) {
    if (_.isEqual(record, originalRecord)) {
      return false;
    }
    return true;
  }

  getRecordsDiffArrObjError(obj: any): boolean {
    // // debugger;
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
    if (this.recordsDiffArrObj) {
      // const url = `${this.origin}${this.tableDataEndPoint}`;
      // let records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'edit', 'remove');

      // let modified = {};
      // for (const key in this.recordsDiffArrObj) {
      //   if (this.recordsDiffArrObj.hasOwnProperty(key)) {
      //     modified[key] = getSetPropertyByValue(JSON.parse(JSON.stringify(this.recordsDiffArrObj[key])), 'edit', 'remove');

      //   }
      // }
      // // // debugger;
      // records = this.setDatePickersToIsoString(records, ['datumOd', 'datumDo']);
      // modified = this.setDatePickersToIsoString(modified, ['datumOd', 'datumDo']);
      // this.store.dispatch(new RecordsSave({ endPoint: url, records, modified, currentUrl: this.currentUrl }));
      // this.recordsDiffArrObj = null;

      const uid = uuidv4();
      // const d = new Date(); // today date
      const dtext = moment().format('YYYY-MM-DD[T]HH:mm:ss'); // d.toISOString();
      const url = `${this.origin}${this.tableDataEndPoint}`;
      let records = JSON.parse(JSON.stringify(this.records));
      records = this.setDatePickersToIsoString(records, ['datumOd', 'datumDo']);
      records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'recordIdBase', 'property_id');
      if (isLocalHostAndMockWay()) {
        records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'id', uid);
      } else {
        records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'id', 'remove');
      }
      records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'status', 'ACTIVE');
      records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'datumPoslednejZmeny', dtext);
      records = getSetArrPropertyByValue(JSON.parse(JSON.stringify(records)), 'autorPoslednejZmeny', this.user?.account?.name);


      debugger;
      this.store.dispatch(new RecordsAddNew({ endPoint: url, records, currentUrl: this.currentUrlTableExtended }));

      this.sendDataToParent(records);
    }
    this.store.dispatch(new StopSpinner());
  }

  getCurrentUrlTableExtended() {
    // debugger;
    // const origin = `${this.origin}`;
    // const endPoint = `${this.tableDataEndPoint}`;
    // const sort = `&_sort=datumPoslednejZmeny`;
    // const order = `&_order=asc`;
    // const page = `&_page=1`;
    // const limit = `&_limit=5`;
    // const url = `${origin}${endPoint}?${sort}${order}${page}${limit}`;
    // this.currentUrlTableExtended = url;

    this.subscription.add(
      this.store.select('tables').subscribe((res: any) => {
        // // debugger;
        if (res) {
          // debugger;
          this.currentUrlTableExtended = res.tableExtendedCurrentUrl;
        }
      })
    );

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
    // debugger;
    this.submitRecordsEvent.emit(records);
  }

}
