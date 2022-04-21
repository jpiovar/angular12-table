import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription, zip } from 'rxjs';

import moment from 'moment';
import * as _ from 'lodash';

import { compareValues, differentValueProperties, getIndexBasedId, getItemBasedId, isoStringtoNgbDateStruct, ngbDateStructToIsoString } from 'src/app/shared/utils/helper';
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
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DialogStepperComponent } from 'src/app/shared/modules/dialog/components/dialog-stepper/dialog-stepper.component';
import { TablesStatus } from 'src/app/state/tables/tables.actions';
import { ExportStatus } from 'src/app/state/export/export.actions';

import $ from 'jquery';


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

  totalPages: any[] = [];
  pages: any[] = [];
  activePage: number = 0;
  recordsPerPage: number = 5;
  totalRecords: number = 0;
  recordsDiffArrObj: any = null;

  sortBy: string = 'op'; // 'opIco';
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

  model2: NgbDateStruct;

  minDate = { year: 2017, month: 1, day: 1 };
  maxDate = { year: 2027, month: 12, day: 1 };

  toggleBtnState: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  ratingOptions: string[] = ['A', 'B', 'C', 'D', 'E'];

  initialSearchFilter: any = {
    // opIco: '',
    op: '',
    ico: '',
    obchodneMeno: '', vypocitanyRating: '', manualnyRating: '', odFrom: '', odTo: '', doFrom: '', doTo: '', poznamka: '', datumZmenyFrom: '', datumZmenyTo: '',
  };

  searchFilter: any = JSON.parse(JSON.stringify(this.initialSearchFilter));

  exportActive: boolean = false;

  user: any;


  tempDate: NgbDate;

  btnVisible: boolean = false;

  markDisabled: any;

  markDisabled1: any;

  markDisabled2: any;


  // @ViewChild('d1') d1datepicker: NgbInputDatepicker;

  // d1close() {
  //   this.d1datepicker.close();
  //   debugger;
  // }


  selectToday() {
    debugger;
    this.model2 = this.calendar.getToday();
    this.markDisabled = (date: NgbDate) => {
      debugger;
      // return this.calendar.getWeekday(date) >= 4;
      return date.before(this.model2) || date.after(this.model2);
    };
    // this.calendar.getWeekday(date) >= 4;
    debugger;
  }

  enableFirst() {

    this.markDisabled = (date: NgbDate) => {
      debugger;
      // this.calendar.getWeekday(date) >= 4;
      // const d = new Date(date.year, date.month - 1, date.day);
      return date.day > 1;
      // || d.getDay() === 0 || d.getDay() === 6;
    };
    // (date: NgbDate) => this.calendar.getWeekday(date) >= 4;
    this.markDisabled1 = (date: NgbDate) => {
      return date.day > 1;
    };
  }


  enableLast() {

    this.markDisabled = (date: NgbDate) => {
      debugger;
      // this.calendar.getWeekday(date) >= 4;
      // const d = new Date(date.year, date.month - 1, date.day);
      return (date.day < 31 && date.month == 1) ||
        (date.day < 28 && date.month == 2 && date.year % 4 !== 0) || (date.day < 29 && date.month == 2 && date.year % 4 === 0) ||
        (date.day < 31 && date.month == 3) || (date.day < 30 && date.month == 4) ||
        (date.day < 31 && date.month == 5) || (date.day < 30 && date.month == 6) ||
        (date.day < 31 && date.month == 7) || (date.day < 31 && date.month == 8) ||
        (date.day < 30 && date.month == 9) || (date.day < 31 && date.month == 10) ||
        (date.day < 30 && date.month == 11) || (date.day < 31 && date.month == 12);
      // || d.getDay() === 0 || d.getDay() === 6;
    };
    // (date: NgbDate) => this.calendar.getWeekday(date) >= 4;
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

  showHideBtn() {
    // debugger;
    this.btnVisible = !this.btnVisible;
    const $confirmSelectionContainer = $('#confirmSelectionContainer');
    const $confirmSelectionBtn = $('#confirmSelection');
    const $dropdownMenu = $('.dropdown-menu.show');

    if (this.btnVisible) {
      $($dropdownMenu).append($confirmSelectionBtn);
      $($confirmSelectionBtn).css({ position: 'absolute', bottom: '20px', left: '40px' });

    } else {
      $($confirmSelectionContainer).append($confirmSelectionBtn);
    }

  }

  confirmSelection(modelName: string, prop: string) {
    // debugger;
    // this.tempDate;
    // const d1 = new Date(); // today date
    // const dtext1 = d1.toISOString();
    const dtext1 = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    if (modelName && prop) {
      this[modelName][prop] = { day: 1, month: 1, year: 2020 }; // isoStringtoNgbDateStruct(dtext1);
    } else if (modelName && !prop) {
      this[modelName] = isoStringtoNgbDateStruct(dtext1);
    }
  }

  changeS(evt) {
    debugger;
  }

  onDateSelection(evt) {
    // debugger;
  }

  changeDate(event) {
    debugger;
    console.log(event);
    this.tempDate = event;
  }

  ds(event) {
    debugger;
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


    this.enableFirst();
    this.enableLast();


    //   $( document ).ready(function() {
    //     $( "#confirmSelection" ).on( "click", function() {
    //       console.log( 'pppppppppppppp');
    //     });
    // });
  }

  ngOnInit(): void {
    this.triggerTableLoad();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createAndExecuteUrl(isFilter?: boolean) {
    // debugger;
    if (isFilter) {
      this.sortBy =  'op'; // 'opIco';
      this.direction = 'asc';
      this.activePage = 0;
    }
    // const origin = `${this.origin}`;
    // const endPoint = `${this.tableDataEndPoint}`;
    // // const statusLike = this.toggleBtnState ? `statusSlike=${this.toggleBtnState}` : '';
    // const statusLike = this.toggleBtnState === 'ACTIVE' ? `statusSne=INACTIVE` : `statusSne=ACTIVE`;
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
    let sSodFrom = '';
    let sSodTo = '';
    let sSdoFrom = '';
    let sSdoTo = '';
    let sSdatumZmenyFrom = '';
    let sSdatumZmenyTo = '';

    // const sSopIco = this.searchFilter?.opIco?.trim() ? `&opIco_like=${this.searchFilter?.opIco?.trim()}` : '';
    const sSop = this.searchFilter?.op?.trim() ? `&op_like=${this.searchFilter?.op?.trim()}` : '';
    const sSico = this.searchFilter?.ico?.trim() ? `&ico_like=${this.searchFilter?.ico?.trim()}` : '';
    const sSobchodneMeno = this.searchFilter?.obchodneMeno?.trim() ? `&obchodneMeno_like=${this.searchFilter?.obchodneMeno?.trim()}` : '';
    const sSvypocitanyRating = this.searchFilter?.vypocitanyRating.trim() ? `&vypocitanyRating_like=${this.searchFilter?.vypocitanyRating?.trim()}` : '';
    const sSmanualnyRating = this.searchFilter?.manualnyRating.trim() ? `&manualnyRating_like=${this.searchFilter?.manualnyRating?.trim()}` : '';

    if (this.searchFilter?.odFrom) {
      const tTodFrom = ngbDateStructToIsoString(this.searchFilter?.odFrom);
      sSodFrom = tTodFrom && `&datumOd_gte=${tTodFrom}`;
    }
    if (this.searchFilter?.odTo) {
      const tTodTo = ngbDateStructToIsoString(this.searchFilter?.odTo);
      sSodTo = tTodTo && `&datumOd_lte=${tTodTo}`;
    }
    if (this.searchFilter?.doFrom) {
      const tTdoFrom = ngbDateStructToIsoString(this.searchFilter?.doFrom);
      sSdoFrom = tTdoFrom && `&datumDo_gte=${tTdoFrom}`;
    }
    if (this.searchFilter?.doTo) {
      const tTdoTo = ngbDateStructToIsoString(this.searchFilter?.doTo);
      sSdoTo = tTdoTo && `&datumDo_lte=${tTdoTo}`;
    }

    const sSpoznamka = this.searchFilter?.poznamka?.trim() ? `&poznamka_like=${this.searchFilter?.poznamka?.trim()}` : '';


    if (this.searchFilter?.datumZmenyFrom) {
      const tTdatumZmenyFrom = ngbDateStructToIsoString(this.searchFilter?.datumZmenyFrom);
      sSdatumZmenyFrom = tTdatumZmenyFrom && `&datumZmeny_gte=${tTdatumZmenyFrom}`;
    }
    if (this.searchFilter?.datumZmenyTo) {
      const tTdatumZmenyTo = ngbDateStructToIsoString(this.searchFilter?.datumZmenyTo);
      sSdatumZmenyTo = tTdatumZmenyTo && `&datumZmeny_lte=${tTdatumZmenyTo}`;
    }

    // const statusLike = this.toggleBtnState ? `statusSlike=${this.toggleBtnState}` : '';
    const statusLike = this.toggleBtnState === 'ACTIVE' ? `status=ACTIVE` : `status=INACTIVE`;
    // const q = this.searchText ? `&q=${this.searchText}` : '';
    const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    const order = this.direction ? `&_order=${this.direction}` : '';
    const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

    const url = `${origin}${endPoint}?${statusLike}${sSop}${sSico}${sSobchodneMeno}${sSvypocitanyRating}${sSmanualnyRating}${sSodFrom}${sSodTo}${sSdoFrom}${sSdoTo}${sSpoznamka}${sSdatumZmenyFrom}${sSdatumZmenyTo}${sort}${order}${page}${limit}`;
    this.currentUrl = url;
    this.store.dispatch(new RecordsLoad(url));
    this.store.dispatch(new TablesStatus({ tableExtendedCurrentUrl: url }));
  }

  activeInactiveToggle(event) {
    // // debugger;
    event.preventDefault();
    if (this.toggleBtnState === 'ACTIVE') {
      this.toggleBtnState = 'INACTIVE';
    } else {
      this.toggleBtnState = 'ACTIVE';
    }
    // const url = `${this.origin}${this.tableDataEndPoint}?statusSlike=${this.toggleBtnState}&_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    // this.store.dispatch(new RecordsLoad(url));
    this.createAndExecuteUrl();
  }

  triggerTableLoad(): void {
    // // debugger;
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
          // // debugger;

          this.store.dispatch(new StopSpinner());

          if (res && !res.loading) {
            // // debugger;
            if (res?.totalRecords > -1) {
              this.totalRecords = res?.totalRecords;
              this.setPagesRecords();
            }

            if (res.data) {
              debugger;
              // if (this.tableMode !== 'log') {
              // this.originalRecords = this.setDatePickersToNgbStruct(this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(res.data)), 'edit', false), ['datumOd', 'datumDo']);
              this.originalRecords = this.setDatePickersToNgbStruct(JSON.parse(JSON.stringify(res.data)), ['datumOd', 'datumDo', 'datumZmeny']);
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
          // // debugger;

          this.store.dispatch(new StopSpinner());

          if (res && !res.loading) {

            if (res.data) {
              // // debugger;

              if (this.tableMode === 'log') {
                this.openChangeLogDialog(this.recordId, res.data[this.recordId]);
              }


            }

          }


        })
    );

    this.subscription.add(
      this.store.select('user').subscribe((res: any) => {
        // debugger;
        if (res) {
          // debugger;
          this.user = res;
        }
      })
    );


    this.subscription.add(
      this.store.select('exportState')
        // .pipe(last())
        .subscribe((res: any) => {
          // debugger;

          this.store.dispatch(new StopSpinner());

          if (res?.status) {
            this.exportActive = res?.status === 'ACTIVE' ? true : false;
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
    // debugger;
    this.tableMode = '';
    const arrLength = Math.ceil(this.totalRecords / this.recordsPerPage);
    this.totalPages = Array.from({ length: arrLength }, (_, i) => i + 1);
    if (this.activePage < 5) {
      this.pages = this.totalPages.slice(0, 10);
    } else if (this.activePage > this.totalPages.length - 5) {
      this.pages = this.totalPages.slice(this.totalPages.length - 10, this.totalPages.length);
    } else {
      this.pages = this.totalPages.slice(this.activePage - 5, this.activePage + 5);
    }
  }

  jumpToPage(page: number): void {
    // // debugger;
    this.activePage = page;
    this.triggerTableLoad();
  }

  previousPage() {
    // // debugger;
    if (this.activePage >= 1) {
      this.activePage--;
      this.triggerTableLoad();
    }
  }

  nextPage() {
    // debugger;
    if (this.activePage < this.totalPages.length - 1) {
      this.activePage++;
      this.triggerTableLoad();
    }
  }

  sortByColumn(colname: string) {
    // // debugger;
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
    // // debugger;
    this.dialogAction = '';
    this.tableMode = '';
    // const recordDetail = getItemBasedId(this.records, id);
    this.dialogRefChangeModal = this.dialog.open(DialogComponent, {
      panelClass: 'change-log-dialog-class',
      id: `change-log-dialog-id-${id}`,
      width: '1000px',
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
      // // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;
      if (this.dialogAction === 'submitBtn') {
        this.tableMode = 'save';
      }

    });

    this.dialogRefChangeModal.afterClosed().subscribe(result => {
      // // debugger;
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
    // // debugger;
    item['progressStatus'] = 'DELETED';
  }

  undoChange(item: any) {
    // // debugger;
    delete item['progressStatus'];
    const itemId = item?.id;
    const index = getIndexBasedId(this.records, itemId);
    this.records[index] = JSON.parse(JSON.stringify(this.originalRecords[index]));
  }

  showHistoryLog(item: any) {
    // debugger;
    // dialog modal, get historyEndpoint/itemId
    this.store.dispatch(new StartSpinner());
    const url = `${this.origin}${this.tableChangeLogs}?recordIdExtended=${item.id}&_sort=datumZmeny&_order=desc`;
    this.recordId = item.id;
    this.tableMode = 'log';
    this.store.dispatch(new LogsLoad({ url, recordId: this.recordId }));
  }

  onInputChange(colname: string, item: any) {
    // // debugger;
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
        item['progressStatus'] = 'CHANGED';
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

      if (colname === 'datumOd' || colname === 'datumDo') {
        const isoDateOd = item[colname] && ngbDateStructToIsoString(item['datumOd']);
        const isoDateDo = item[colname] && ngbDateStructToIsoString(item['datumDo']);

        if (isoDateOd && isoDateDo && isoDateOd > isoDateDo) {
          item['ErrorInterval'] = true;
        } else {
          delete item['ErrorInterval'];
        }

        if (isoDateOd && item?.datumVytvoreniaPoslednejSnimky >= isoDateOd) {
          item['ErrorMin'] = true;
        } else {
          delete item['ErrorMin'];
        }

      }

    }

    if (this.recordsDiffArrObj) {
      this.store.dispatch(new TablesStatus({ tableExtended: 'inprogress' }));
    }
    else {
      this.store.dispatch(new TablesStatus({ tableExtended: 'ready' }));
    }

  }


  recordsItemChanged(recordsItem, originalRecordsItem) {
    // // debugger;
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
    // debugger;
    if (this.recordsDiffArrObj) {
      const url = `${this.origin}${this.tableDataEndPoint}`;
      const originalRecords = JSON.parse(JSON.stringify(this.originalRecords));
      // let records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'edit', 'remove');
      let records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'progressStatus', 'remove');
      let previousStateRecords = [];
      for (const key in this.recordsDiffArrObj) {
        if (this.recordsDiffArrObj.hasOwnProperty(key)) {
          // debugger;

          const i = getIndexBasedId(originalRecords, key);
          const j = getIndexBasedId(records, key);
          const action = {};
          let modifiedCols = {};
          let modifiedProp = {};

          records[j].autorZmeny = this.user?.account?.name;
          records[j].datumZmeny = moment().format('YYYY-MM-DD[T]HH:mm:ss'); // new Date().toISOString();

          // this.recordsDiffArrObj[key] = this.getSetPropertyByValue(JSON.parse(JSON.stringify(this.recordsDiffArrObj[key])), 'edit', 'remove');
          if (this.recordsDiffArrObj[key]['progressStatus'] === 'DELETED') {
            this.recordsDiffArrObj[key] = this.getSetPropertyByValue(this.recordsDiffArrObj[key], 'status', 'INACTIVE');
            const index = getIndexBasedId(records, key); // itemId === key;
            records[index]['status'] = 'INACTIVE';
            action['actionType'] = 'DELETED';
          } else if (this.recordsDiffArrObj[key]['progressStatus'] === 'CHANGED') {
            // debugger;
            action['actionType'] = 'CHANGED';

            const diffValProp = differentValueProperties(originalRecords[i], records[j]);
            modifiedCols = diffValProp.map(function (item) {
              if (item?.propName === 'datumOd' || item?.propName === 'datumDo') {
                return {
                  colName: item.propName,
                  newValue: ngbDateStructToIsoString(item.newValue)
                };
              } else {
                return {
                  colName: item.propName,
                  newValue: item.newValue
                };
              }
            });

            modifiedProp = {
              modifiedColumns: modifiedCols
            };



          }

          this.recordsDiffArrObj[key] = this.getSetPropertyByValue(this.recordsDiffArrObj[key], 'progressStatus', 'remove');
          previousStateRecords.push({
            ...originalRecords[i],
            ...{
              autorZmeny: this.user?.account?.name,
              datumZmeny: moment().format('YYYY-MM-DD[T]HH:mm:ss') // new Date().toISOString()
            },
            ...action,
            ...modifiedProp
          });

        }
      }
      // debugger;
      records = this.setDatePickersToIsoString(records, ['datumOd', 'datumDo']);
      previousStateRecords = this.setDatePickersToIsoString(previousStateRecords, ['datumOd', 'datumDo']);

      this.store.dispatch(new RecordsSave({ endPoint: url, previousStateRecords, records, currentUrl: this.currentUrl }));
      this.recordsDiffArrObj = null;

      this.store.dispatch(new TablesStatus({ tableExtended: 'ready' }));
    }

    // this.exportActive = true;
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
    // // debugger;
    this.globalFilter = '';
    this.searchText = '';
    this.globalSearch();
  }

  processGlobalSearch() {
    // // debugger;
    this.subscription.add(
      this.searchTextChanged.pipe(debounceTime(1000)).subscribe(
        response => {
          // // debugger;
          this.isSearching = false;
          const res = response.trim();
          if (res) {
            this.searchText = res;
            this.sortBy = 'op'; // 'opIco';
            this.direction = 'asc';
            if (this.searchMode === 'global') {
              // const url = `${this.origin}${this.tableDataEndPoint}?q=${this.searchText}&_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
              // this.store.dispatch(new RecordsLoad(url));
              this.createAndExecuteUrl();
            }
          } else {
            this.searchText = '';
            this.sortBy = 'op'; // 'opIco';
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
    // // debugger;
    const id = new Date();
    this.dialogRefNewRecordModal = this.dialog.open(DialogStepperComponent, {
      panelClass: 'new-record-dialog-class',
      id: `new-record-dialog-id-${id}`,
      width: '1000px',
      height: 'auto',
      // minHeight: '500px',
      data: {
        title: 'New record dialog',
        type: 'newRecord',
        mode: 'view'
      }
    });

    this.dialogRefNewRecordModal.beforeClosed().subscribe(result => {
      // // debugger;
      console.log(`Dialog result: ${result}`);
    });

    this.dialogRefNewRecordModal.afterClosed().subscribe(result => {
      // // debugger;
      console.log(`Dialog result: ${result}`);
    });
  }

  triggerPartialFilters() {
    // debugger;
    // const origin = `${this.origin}`;
    // const endPoint = `${this.tableDataEndPoint}`;
    // let sSopIco = '';
    // let sSobchodneMeno = '';
    // let sSvypocitanyRating = '';
    // let sSmanualnyRating = '';
    // let sSod = '';
    // let sSdo = '';
    // let sSpoznamka = '';

    // if (this.searchFilter?.opIco) {
    //   sSopIco = this.searchFilter?.opIco?.trim();
    // }
    // if (this.searchFilter?.obchodneMeno) {
    //   sSobchodneMeno = this.searchFilter?.obchodneMeno?.trim();
    // }
    // if (this.searchFilter?.vypocitanyRating) {
    //   sSvypocitanyRating = this.searchFilter?.vypocitanyRating;
    // }
    // if (this.searchFilter?.manualnyRating) {
    //   sSmanualnyRating = this.searchFilter?.manualnyRating;
    // }
    // if (this.searchFilter?.od) {
    //   sSod = ngbDateStructToIsoString(this.searchFilter?.od);
    // }
    // if (this.searchFilter?.do) {
    //   sSdo = ngbDateStructToIsoString(this.searchFilter?.do);
    // }
    // if (this.searchFilter?.poznamka) {
    //   sSpoznamka = this.searchFilter?.poznamka?.trim();
    // }


    // // const statusLike = this.toggleBtnState ? `statusSlike=${this.toggleBtnState}` : '';
    // const statusLike = this.toggleBtnState === 'ACTIVE' ? `statusSne=INACTIVE` : `statusSne=ACTIVE`;
    // // const q = this.searchText ? `&q=${this.searchText}` : '';
    // const sort = this.sortBy ? `&_sort=${this.sortBy}` : '';
    // const order = this.direction ? `&_order=${this.direction}` : '';
    // const page = this.activePage > -1 ? `&_page=${this.activePage + 1}` : '';
    // const limit = this.recordsPerPage > 0 ? `&_limit=${this.recordsPerPage}` : '';

    // const url = `${origin}${endPoint}?${statusLike}${sSopIco}${sSobchodneMeno}${sSvypocitanyRating}${sSmanualnyRating}${sSod}${sSdo}${sSpoznamka}${sort}${order}${page}${limit}`;
    // this.currentUrl = url;
    // this.store.dispatch(new RecordsLoad(url));

    this.createAndExecuteUrl(true);
  }

  clearInput(input: string) {
    // debugger;
    if (input === 'all') {
      this.searchFilter = JSON.parse(JSON.stringify(this.initialSearchFilter));
      this.triggerPartialFilters();
    } else {
      if (this.searchFilter.hasOwnProperty(input)) {
        this.searchFilter[input] = '';
      }
    }
  }

  exportToDwh() {
    // debugger;
    // code logic to trigger export
    this.store.dispatch(new ExportStatus({ status: 'INACTIVE' }));
  }

  // dateSelected(event: any) {
  //   // debugger;
  //   this.tempDate = event;
  // }

}
