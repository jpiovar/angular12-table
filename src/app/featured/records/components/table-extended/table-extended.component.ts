import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TablesStatus } from 'src/app/state/tables/tables.actions';



@Component({
  selector: 'app-table-extended',
  templateUrl: './table-extended.component.html',
  styleUrls: ['./table-extended.component.scss']
})

export class TableExtendedComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  tableDataEndPoint: string;
  tableChangeLogs: string;
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
  dialogRefChangeModal: MatDialogRef<any>;
  dialogRefNewRecordModal: MatDialogRef<any>;
  recordId: string = '';
  dialogAction: string = '';
  tableMode: 'init' | 'load' | 'save' | 'edit' | 'read' | 'remove' | 'log' | '' = '';
  searchMode: 'init' | 'global' | '';
  globalFilter: string = '';
  isSearching: boolean = false;
  searchTextChanged: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchText: string = '';

  date: any = new Date();
  // model1: NgbDateStruct = { day: this.date.getUTCDate(), month: this.date.getUTCMonth()+1, year: this.date.getUTCFullYear()};
  model1: NgbDateStruct = isoStringtoNgbDateStruct('2020-01-10T00:00:00');

  minDate = { year: 2017, month: 1, day: 1 };
  maxDate = { year: 2027, month: 12, day: 1 };

  toggleBtnState: 'active' | 'inactive' = 'active';

  ratingOptions: string[] = ['A', 'B', 'C', 'D', 'E'];

  initialSearchFilter: any = {
    op_ico: '', obchodne_meno: '', vypocitany_rating: '', manualny_rating: '', od: '', do: '', poznamka: ''
  };

  searchFilter: any = JSON.parse(JSON.stringify(this.initialSearchFilter));


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
    this.tableChangeLogs = environment.beTableChangeLogs;
    this.tableMode = 'init';
    this.searchMode = 'init';

    this.metaAndTableDataSubscription();
    this.processGlobalSearch();
  }

  ngOnInit(): void {
    this.triggerTableLoad();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createAndExecuteUrl() {
    debugger;
    // const origin = `${this.origin}`;
    // const endPoint = `${this.tableDataEndPoint}`;
    // // const statusLike = this.toggleBtnState ? `status_like=${this.toggleBtnState}` : '';
    // const statusLike = this.toggleBtnState === 'active' ? `status_ne=inactive` : `status_ne=active`;
    // const q = this.searchText ? `&q=${this.searchText}` : '';
    // const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    // const order = this.direction ? `&_order=${this.direction}` : '';
    // const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    // const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

    // const url = `${origin}${endPoint}?${statusLike}${q}${sort}${order}${page}${limit}`;
    // this.currentUrl = url;
    // this.store.dispatch(new RecordsLoad(url));

    const origin = `${this.origin}`;
    const endPoint = `${this.tableDataEndPoint}`;
    let s_od = '';
    let s_do = '';

    const s_op_ico = this.searchFilter?.op_ico?.trim() ? `&op_ico_like=${this.searchFilter?.op_ico?.trim()}` : '';
    const s_obchodne_meno = this.searchFilter?.obchodne_meno?.trim() ? `&obchodne_meno_like=${this.searchFilter?.obchodne_meno?.trim()}` : '';
    const s_vypocitany_rating = this.searchFilter?.vypocitany_rating.trim() ? `&vypocitany_rating_like=${this.searchFilter?.vypocitany_rating?.trim()}` : '';
    const s_manualny_rating = this.searchFilter?.manualny_rating.trim() ? `&manualny_rating_like=${this.searchFilter?.manualny_rating?.trim()}` : '';

    if (this.searchFilter?.od) {
      s_od = ngbDateStructToIsoString(this.searchFilter?.od);
    }
    if (this.searchFilter?.do) {
      s_do = ngbDateStructToIsoString(this.searchFilter?.do);
    }

    const s_poznamka = this.searchFilter?.poznamka?.trim() ? `&poznamka_like=${this.searchFilter?.poznamka?.trim()}` : '';


    // const statusLike = this.toggleBtnState ? `status_like=${this.toggleBtnState}` : '';
    const statusLike = this.toggleBtnState === 'active' ? `status_ne=inactive` : `status_ne=active`;
    // const q = this.searchText ? `&q=${this.searchText}` : '';
    const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    const order = this.direction ? `&_order=${this.direction}` : '';
    const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

    const url = `${origin}${endPoint}?${statusLike}${s_op_ico}${s_obchodne_meno}${s_vypocitany_rating}${s_manualny_rating}${s_od}${s_do}${s_poznamka}${sort}${order}${page}${limit}`;
    this.currentUrl = url;
    this.store.dispatch(new RecordsLoad(url));
  }

  activeInactiveToggle(event) {
    // debugger;
    event.preventDefault();
    if (this.toggleBtnState === 'active') {
      this.toggleBtnState = 'inactive';
    } else {
      this.toggleBtnState = 'active';
    }
    // const url = `${this.origin}${this.tableDataEndPoint}?status_like=${this.toggleBtnState}&_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    // this.store.dispatch(new RecordsLoad(url));
    this.createAndExecuteUrl();
  }

  triggerTableLoad(): void {
    // debugger;
    this.tableMode = 'load';
    this.store.dispatch(new StartSpinner());
    // let url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=asc&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    // if (this.searchText) {
    //   url = `${this.origin}${this.tableDataEndPoint}?q=${this.searchText}&_sort=${this.sortBy}&_order=asc&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    // }
    // this.store.dispatch(new RecordsLoad(url));
    this.createAndExecuteUrl();
  }

  metaAndTableDataSubscription() {
    this.subscription.add(
      this.store.select('records')
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
              // if (this.tableMode !== 'log') {
              // this.originalRecords = this.setDatePickersToNgbStruct(this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(res.data)), 'edit', false), ['od', 'do']);
              this.originalRecords = this.setDatePickersToNgbStruct(JSON.parse(JSON.stringify(res.data)), ['od', 'do']);
              this.records = JSON.parse(JSON.stringify(this.originalRecords));
              // }
            }

          }


        })
    );

    this.subscription.add(
      this.store.select('logs')
        // .pipe(last())
        .subscribe((res: any) => {
          // debugger;

          this.store.dispatch(new StopSpinner());

          if (res && !res.loading) {

            if (res.data) {
              // debugger;

              if (this.tableMode === 'log') {
                this.openChangeLogDialog(this.recordId, res.data[this.recordId]);
              }


            }

          }


        })
    );
  }

  setDatePickersToNgbStruct(arrObj: any[], props: string[]) {
    const arr: any[] = JSON.parse(JSON.stringify(arrObj));
    for (let j = 0; j < props.length; j++) {
      const currentProp = props[j];
      for (let i = 0; i < arr.length; i++) {
        arr[i][currentProp] = isoStringtoNgbDateStruct(arr[i][currentProp]);
      }
    }
    return arr;
  }

  getSetArrPropertyByValue(records: any, propertyName: string, propertyValue: any) {
    const res = JSON.parse(JSON.stringify(records));
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
    const res = JSON.parse(JSON.stringify(record));
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
    // let url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    // if (this.searchText) {
    //   url = `${this.origin}${this.tableDataEndPoint}?q=${this.searchText}&_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    // }
    // this.store.dispatch(new RecordsLoad(url));
    this.createAndExecuteUrl();
  }

  openChangeLogDialog(id: string, changeLog) {
    // debugger;
    this.dialogAction = '';
    this.tableMode = '';
    // const recordDetail = getItemBasedId(this.records, id);
    this.dialogRefChangeModal = this.dialog.open(DialogComponent, {
      panelClass: 'change-log-dialog-class',
      id: `change-log-dialog-id-${id}`,
      width: '800px',
      height: 'auto',
      // minHeight: '500px',
      data: {
        title: 'Change log dialog',
        changeLog,
        type: 'changeLog',
        mode: 'view'
      }
    });

    this.dialogRefChangeModal.beforeClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;
      if (this.dialogAction === 'submitBtn') {
        this.tableMode = 'save';
      }

    });

    this.dialogRefChangeModal.afterClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;
      if (this.dialogAction === 'submitBtn') {
        this.tableMode = 'save';
      }
    });
  }

  // switchToEditMode(item: any) {
  //   this.recordId = item.id;
  //   this.tableMode = 'edit';
  //   item.read = false;
  // }

  // switchToReadMode(item: any) {
  //   this.recordId = item.id;
  //   this.tableMode = 'read';
  //   item.read = true;
  // }

  // removeItem(item: any) {
  //   this.store.dispatch(new StartSpinner());
  //   const url = `${this.origin}${this.tableDataEndPoint}`;
  //   const records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'edit', 'remove');
  //   const deleted = {};

  //   const key = item?.id;
  //   deleted[key] = this.getSetPropertyByValue(JSON.parse(JSON.stringify(item)), 'edit', 'remove');
  //   this.store.dispatch(new RecordsDelete({ endPoint: url, records, deleted }));
  //   this.tableMode = 'remove';
  // }

  removeItem(item: any) {
    // debugger;
    item['progressStatus'] = 'removed';
  }

  undoChange(item: any) {
    // debugger;
    delete item['progressStatus'];
    const itemId = item?.id;
    const index = getIndexBasedId(this.records, itemId);
    this.records[index] = JSON.parse(JSON.stringify(this.originalRecords[index]));
  }

  showHistoryLog(item: any) {
    // debugger;
    // dialog modal, get historyEndpoint/itemId
    this.store.dispatch(new StartSpinner());
    const url = `${this.origin}${this.tableChangeLogs}?recordId=${item.id}`;
    this.recordId = item.id;
    this.tableMode = 'log';
    this.store.dispatch(new LogsLoad({ url, recordId: this.recordId }));
  }

  onInputChange(colname: string, item: any) {
    // debugger;
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

    if (this.recordsDiffArrObj) {
      this.store.dispatch(new TablesStatus({tableExtended:'inprogress'}));
    }
    else {
      this.store.dispatch(new TablesStatus({tableExtended:'ready'}));
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
    // debugger;
    if (this.recordsDiffArrObj) {
      const url = `${this.origin}${this.tableDataEndPoint}`;
      let records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'edit', 'remove');
      records = this.getSetArrPropertyByValue(records, 'progressStatus', 'remove');
      let modified = {};
      for (const key in this.recordsDiffArrObj) {
        if (this.recordsDiffArrObj.hasOwnProperty(key)) {
          modified[key] = this.getSetPropertyByValue(JSON.parse(JSON.stringify(this.recordsDiffArrObj[key])), 'edit', 'remove');
          if (modified[key]['progressStatus'] === 'removed') {
            modified[key] = this.getSetPropertyByValue(modified[key], 'status', 'inactive');
            const index = getIndexBasedId(records, key); // itemId === key;
            records[index]['status'] = 'inactive';
          }
          modified[key] = this.getSetPropertyByValue(modified[key], 'progressStatus', 'remove');
        }
      }
      debugger;
      records = this.setDatePickersToIsoString(records, ['od', 'do']);
      modified = this.setDatePickersToIsoString(modified, ['od', 'do']);
      this.store.dispatch(new RecordsSave({ endPoint: url, records, modified, currentUrl: this.currentUrl }));
      this.recordsDiffArrObj = null;

      this.store.dispatch(new TablesStatus({tableExtended:'ready'}));
    }


  }

  setDatePickersToIsoString(arrObj: any, props: string[]) {
    const arr: any[] = JSON.parse(JSON.stringify(arrObj));
    for (let j = 0; j < props.length; j++) {
      const currentProp = props[j];
      // for (let i = 0; i < arr.length; i++) {
      //   arr[i][currentProp] = ngbDateStructToIsoString(arr[i][currentProp]);
      // }
      for (const i in arr) { // accepts array and object
        if (arr.hasOwnProperty(i)) {
          arr[i][currentProp] = ngbDateStructToIsoString(arr[i][currentProp]);
        }
      }
    }
    return arr;
  }

  globalSearch() {
    this.isSearching = true;
    this.searchTextChanged.next(this.globalFilter);
  }

  clearAllFilters() {
    // debugger;
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
              // const url = `${this.origin}${this.tableDataEndPoint}?q=${this.searchText}&_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
              // this.store.dispatch(new RecordsLoad(url));
              this.createAndExecuteUrl();
            }
          } else {
            this.searchText = '';
            this.sortBy = 'op_ico';
            this.direction = 'asc';
            if (this.searchMode === 'global') {
              // const url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
              // this.store.dispatch(new RecordsLoad(url));
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

  // getFilteredRecords(records: any[], propertyValue: string) {
  //   return records.filter(item => item.firstname.indexOf(propertyValue) > -1 || item.surname.indexOf(propertyValue) > -1 || item.age.indexOf(propertyValue) > -1);
  // }


  insertNewRecord() {
    // debugger;
    const id = new Date();
    this.dialogRefNewRecordModal = this.dialog.open(DialogStepperComponent, {
      panelClass: 'new-record-dialog-class',
      id: `new-record-dialog-id-${id}`,
      width: '800px',
      height: 'auto',
      // minHeight: '500px',
      data: {
        title: 'New record dialog',
        type: 'newRecord',
        mode: 'view'
      }
    });

    this.dialogRefNewRecordModal.beforeClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
    });

    this.dialogRefNewRecordModal.afterClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
    });
  }

  triggerPartialFilters() {
    debugger;
    // const origin = `${this.origin}`;
    // const endPoint = `${this.tableDataEndPoint}`;
    // let s_op_ico = '';
    // let s_obchodne_meno = '';
    // let s_vypocitany_rating = '';
    // let s_manualny_rating = '';
    // let s_od = '';
    // let s_do = '';
    // let s_poznamka = '';

    // if (this.searchFilter?.op_ico) {
    //   s_op_ico = this.searchFilter?.op_ico?.trim();
    // }
    // if (this.searchFilter?.obchodne_meno) {
    //   s_obchodne_meno = this.searchFilter?.obchodne_meno?.trim();
    // }
    // if (this.searchFilter?.vypocitany_rating) {
    //   s_vypocitany_rating = this.searchFilter?.vypocitany_rating;
    // }
    // if (this.searchFilter?.manualny_rating) {
    //   s_manualny_rating = this.searchFilter?.manualny_rating;
    // }
    // if (this.searchFilter?.od) {
    //   s_od = ngbDateStructToIsoString(this.searchFilter?.od);
    // }
    // if (this.searchFilter?.do) {
    //   s_do = ngbDateStructToIsoString(this.searchFilter?.do);
    // }
    // if (this.searchFilter?.poznamka) {
    //   s_poznamka = this.searchFilter?.poznamka?.trim();
    // }


    // // const statusLike = this.toggleBtnState ? `status_like=${this.toggleBtnState}` : '';
    // const statusLike = this.toggleBtnState === 'active' ? `status_ne=inactive` : `status_ne=active`;
    // // const q = this.searchText ? `&q=${this.searchText}` : '';
    // const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    // const order = this.direction ? `&_order=${this.direction}` : '';
    // const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    // const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

    // const url = `${origin}${endPoint}?${statusLike}${s_op_ico}${s_obchodne_meno}${s_vypocitany_rating}${s_manualny_rating}${s_od}${s_do}${s_poznamka}${sort}${order}${page}${limit}`;
    // this.currentUrl = url;
    // this.store.dispatch(new RecordsLoad(url));

    this.createAndExecuteUrl();
  }

  clearInput(input: string) {
    debugger;
    if (input === 'all') {
       this.searchFilter  = JSON.parse(JSON.stringify(this.initialSearchFilter));
    } else {
      if (this.searchFilter.hasOwnProperty(input)) {
        this.searchFilter[input] = '';
      }
    }
  }


}
