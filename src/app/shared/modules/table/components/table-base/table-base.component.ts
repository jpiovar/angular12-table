import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription, zip } from 'rxjs';

import * as _ from 'lodash';

import { compareValues, getIndexBasedId, getItemBasedId, isoStringtoNgbDateStruct, ngbDateStructToIsoString } from 'src/app/shared/utils/helper';
import { AppState } from 'src/app/state';
import {
  // ChangeLogLoad, MetaLoad, MetaLocalSave,
  RecordsDelete, RecordsLoad, RecordsSave
} from 'src/app/state/records/records.actions';
import { environment } from 'src/environments/environment';
import { compare } from 'natural-orderby';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, map } from 'rxjs/operators';

import { StartSpinner, StopSpinner } from 'src/app/state/spinner/spinner.actions';


import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RecordsBaseLoad } from 'src/app/state/records-base/records-base.actions';



@Component({
  selector: 'app-table-base',
  templateUrl: './table-base.component.html',
  styleUrls: ['./table-base.component.scss']
})

export class TableBaseComponent implements OnInit, OnDestroy {
  @Output() newItemsEvent = new EventEmitter<any>();

  subscription: Subscription = new Subscription();
  tableDataBaseEndPoint: string;
  origin: string;
  currentUrl: string = '';
  originalRecords: any[];
  records: any[];

  pages: any[] = [];
  activePage: number = 0;
  recordsPerPage: number = 5;
  totalRecords: number = 0;
  recordsDiffArrObj: any = null;

  sortBy: string = 'op_ico';
  sortByCol: any = {};
  direction: 'asc' | 'desc' = 'asc';
  recordId: string = '';
  dialogAction: string = '';
  tableMode: 'init' | 'load' | 'save' | 'edit' | 'read' | 'remove' | 'log' | '' = '';
  searchMode: 'init' | 'global' | '';
  globalFilter: string = '';
  isSearching: boolean = false;
  searchTextChanged: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchText: string = '';

  date: any = new Date();

  ratingOptions: string[] = ['A', 'B', 'C', 'D', 'E'];


  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    public formatter: NgbDateParserFormatter
  ) {
    this.origin = environment.beOrigin;
    this.tableDataBaseEndPoint = environment.beTableDataBaseEndPoint;
    this.tableMode = 'init';
    this.searchMode = 'init';

    this.metaAndTableDataSubscription();
    this.processGlobalSearch();
  }

  ngOnInit(): void {
    debugger;
    this.triggerTableLoad();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createAndExecuteUrl() {
    debugger;
    const origin = `${this.origin}`;
    const endPoint = `${this.tableDataBaseEndPoint}`;
    const q = this.searchText ? `&q=${this.searchText}` : '';
    const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    const order = this.direction ? `&_order=${this.direction}` : '';
    const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

    const url = `${origin}${endPoint}?${q}${sort}${order}${page}${limit}`;
    this.currentUrl = url;
    this.store.dispatch(new RecordsBaseLoad(url));
  }



  triggerTableLoad(): void {
    // debugger;
    this.tableMode = 'load';
    this.store.dispatch(new StartSpinner());
    this.createAndExecuteUrl();
  }

  metaAndTableDataSubscription() {
    this.subscription.add(
      this.store.select('recordsBase')
        // .pipe(last())
        .subscribe((res: any) => {
          // debugger;

          this.store.dispatch(new StopSpinner());

          if (res && !res.loading) {
            // debugger;
            if (res?.totalRecords > -1) {
              this.totalRecords = res?.totalRecords;
              this.setPagesRecords();
            }

            if (res.data) {
              // debugger;
              // this.originalRecords = this.setDatePickersToNgbStruct(JSON.parse(JSON.stringify(res.data)), ['od', 'do']);
              this.originalRecords = JSON.parse(JSON.stringify(res.data));
              this.records = JSON.parse(JSON.stringify(this.originalRecords));
              // }
            }

          }


        })
    );

  }

  // setDatePickersToNgbStruct(arrObj: any[], props: string[]) {
  //   const arr: any[] = JSON.parse(JSON.stringify(arrObj));
  //   for (let j = 0; j < props.length; j++) {
  //     const currentProp = props[j];
  //     for (let i = 0; i < arr.length; i++) {
  //       arr[i][currentProp] = isoStringtoNgbDateStruct(arr[i][currentProp]);
  //     }
  //   }
  //   return arr;
  // }

  getSetArrPropertyByValue(records: any, propertyName: string, propertyValue: any) {
    let res = JSON.parse(JSON.stringify(records));
    for (let index = 0; index < res.length; index++) {
      if (propertyValue === 'remove') {
        delete res[index][propertyName];
      } else {
        res[index][propertyName] = propertyValue;
      }
    }
    return res;
  }

  getSetPropertyByValue(record: any, propertyName: string, propertyValue: any) {
    let res = JSON.parse(JSON.stringify(record));
    if (propertyValue === 'remove') {
      delete res[propertyName];
    } else {
      res[propertyName] = propertyValue;
    }
    return res;
  }



  setPagesRecords() {
    // // debugger;
    this.tableMode = '';
    this.pages = new Array(Math.ceil(this.totalRecords / this.recordsPerPage));
  }

  jumpToPage(page: number): void {
    // debugger;
    this.activePage = page;
    this.triggerTableLoad();
  }

  previousPage() {
    // debugger;
    if (this.activePage >= 1) {
      this.activePage--;
      this.triggerTableLoad();
    }
  }

  nextPage() {
    // debugger;
    if (this.activePage < this.pages.length - 1) {
      this.activePage++;
      this.triggerTableLoad();
    }
  }

  sortByColumn(colname: string) {
    // debugger;
    this.sortByCol = {};
    this.activePage = 0;

    if (this.sortBy !== colname) {
      this.sortBy = colname;
      this.direction = 'asc';
    } else {
      if (this.direction === 'asc') {
        this.direction = 'desc';
      } else {
        this.direction = 'asc';
      }
    }
    this.sortByCol[colname] = this.direction;

    this.store.dispatch(new StartSpinner());

    this.createAndExecuteUrl();
  }







  onInputChange(colname: string, item: any) {
    debugger;
    // const itemId = this.records[index]?.id;
    const itemId = item?.id;
    const index = getIndexBasedId(this.records, itemId);
    if (colname) {
      delete item['progressStatus'];
    }
    const recordItemChanged = this.recordsItemChanged(this.records[index], this.originalRecords[index]);
    if (recordItemChanged) {
      if (this.recordsDiffArrObj === null) {
        this.recordsDiffArrObj = {};
      }
      const temp = JSON.parse(JSON.stringify((this.recordsDiffArrObj)));
      temp[itemId] = this.records[index];
      this.recordsDiffArrObj = { ...this.recordsDiffArrObj, ...temp };
      if (colname) {
        item['progressStatus'] = 'changed';
      }
    } else {
      delete this.recordsDiffArrObj[itemId];
    }
    if (JSON.stringify(this.recordsDiffArrObj) === '{}') {
      this.recordsDiffArrObj = null;
    }

    if (colname) {

      if (!item[colname]) {
        item[colname + 'ErrorRequired'] = true;
        // this.recordsDiffArrObj['error'] = true;
      } else {
        delete item[colname + 'ErrorRequired'];
        // if (this.recordsDiffArrObj?.error) {
        //   delete this.recordsDiffArrObj['error'];
        // }
      }

      // if (colname === 'od' || colname === 'do') {
      //   const isoDateOd = ngbDateStructToIsoString(item['od']);
      //   const isoDateDo = ngbDateStructToIsoString(item['do']);

      //   if (isoDateOd && isoDateDo && isoDateOd > isoDateDo) {
      //     item['ErrorInterval'] = true;
      //   } else {
      //     delete item['ErrorInterval'];
      //   }
      // }

    }


  }


  recordsItemChanged(recordsItem, originalRecordsItem) {
    debugger;
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
    debugger;
    let res = false;
    for (const i in obj) {
      const keys = Object.keys(obj[i]);
      if (keys.join(',').indexOf('Error') > -1) {
        res = true;
        break;
      }
    }
    return res;
  }



  // setDatePickersToIsoString(arrObj: any, props: string[]) {
  //   const arr: any[] = JSON.parse(JSON.stringify(arrObj));
  //   for (let j = 0; j < props.length; j++) {
  //     const currentProp = props[j];
  //     // for (let i = 0; i < arr.length; i++) {
  //     //   arr[i][currentProp] = ngbDateStructToIsoString(arr[i][currentProp]);
  //     // }
  //     for (const i in arr) { // accepts array and object
  //       arr[i][currentProp] = ngbDateStructToIsoString(arr[i][currentProp]);
  //     }
  //   }
  //   return arr;
  // }

  globalSearch() {
    this.isSearching = true;
    this.searchTextChanged.next(this.globalFilter);
  }

  clearAllFilters() {
    // // debugger;
    this.globalFilter = '';
    this.searchText = '';
    this.globalSearch();
  }

  processGlobalSearch() {
    // debugger;
    this.subscription.add(
      this.searchTextChanged.pipe(debounceTime(1000)).subscribe(
        response => {
          // debugger;
          this.isSearching = false;
          const res = response.trim();
          if (res) {
            this.searchText = res;
            this.sortBy = 'op_ico';
            this.direction = 'asc';
            if (this.searchMode === 'global') {
              this.createAndExecuteUrl();
            }
          } else {
            this.searchText = '';
            this.sortBy = 'op_ico';
            this.direction = 'asc';
            if (this.searchMode === 'global') {
              this.createAndExecuteUrl();
            }
          }
          this.searchMode = 'global';
        },
        error => {
          this.isSearching = false;
          throw error;
        }
      ));
  }

  doubleClick(itemRecord: any): void {
    console.log('double click');
    this.sendDataToParent([itemRecord]);
  }

  singleClick(event: Event): void {
    console.log('single click');
  }

  sendDataToParent(records: any) {
    debugger;
    this.newItemsEvent.emit(records);
  }

}
