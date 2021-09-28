import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription, zip } from 'rxjs';
import { compareValues, getIndexBasedId, getItemBasedId } from 'src/app/shared/utils/helper';
import { AppState } from 'src/app/state';
import { MetaLoad, RecordsLoad, RecordsSave } from 'src/app/state/records/records.actions';
import { environment } from 'src/environments/environment';
import { compare } from 'natural-orderby';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { HttpBaseService } from 'src/app/core/services/http.base.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  tableDataEndPoint: string;
  metaDataEndPoint: string;
  // tableRecordEndPoint: string;
  origin: string;
  originalRecords: any[];
  sortedOriginalRecords: any[];
  records: any[];
  pages: any[] = [];
  itemsPerPage: number = 5;
  activePage: number = 0;
  sortBy: string = 'firstname';
  sortByCol: any = {};
  direction: 'asc' | 'desc' = 'asc';
  dialogRef: MatDialogRef<any>;
  recordId: string = '';
  dialogAction: string = '';
  tableMode: 'init' | 'load' | 'save' | 'edit' | 'read' | '' = '';
  searchMode: 'init' | 'global' | '';
  globalFilter: string = '';
  isSearching: boolean = false;
  searchTextChanged: BehaviorSubject<string> = new BehaviorSubject<string>('');

  recordsPerPage: number = 5;
  paginationPages: number = 0;
  totalRecords: number = 0;
  recordsDiffArrObj: any = null;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private httpBase: HttpBaseService,
    private httpClient: HttpClient
  ) {
    this.origin = environment.beOrigin;
    this.tableDataEndPoint = environment.beTableDataEndPoint;
    this.metaDataEndPoint = environment.beMetaDataEndPoint;
    this.tableMode = 'init';
    this.searchMode = 'init';
    this.triggerMetaLoad();
    // this.triggerTableLoad();
    this.metaAndTableDataSubscription();
    this.processGlobalSearch();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  triggerMetaLoad(): void {
    debugger;
    const url = `${this.origin}${this.metaDataEndPoint}`;
    this.store.dispatch(new MetaLoad(url));
  }

  triggerTableLoad(): void {
    // debugger;
    const url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=asc&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    this.store.dispatch(new RecordsLoad(url));
  }

  // triggerTableRecordLoad(origin: string, dataEndPoint: string, id: string): void {
  //   // debugger;
  //   const url = `${origin}${dataEndPoint}/${id}`;
  //   this.store.dispatch(new RecordLoadDetail({ id, detail: url, storeMode: true }));
  // }

  metaAndTableDataSubscription() {
    this.subscription.add(
      this.store.select('records')
        // .pipe(last())
        .subscribe((res: any) => {
          debugger;

          if (res && !res.loading) {

            if (res.totalRecords > -1) {
              if (this.tableMode === 'init') {
                this.totalRecords = 0;
                this.totalRecords = res?.totalRecords;
                this.setPagesRecords();
              }
            }

            if (res.data) {
              // debugger;
              this.originalRecords = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(res.data)), 'edit', false);
              this.records = JSON.parse(JSON.stringify(this.originalRecords));

              debugger;

              // if (this.tableMode === 'init') {
              //   // this.sortedOriginalRecords = JSON.parse(JSON.stringify(this.originalRecords));
              //   // this.sortByColumn(this.sortBy);
              //   // this.setPagesRecords();
              // } else if (this.tableMode === 'load' && this.recordId) {
              //   // debugger;
              //   this.setTargetSortedRecord(this.recordId);
              //   this.openViewEditDialog(this.recordId);
              // } else if (this.tableMode === 'save' && this.recordId) {
              //   this.setTargetSortedRecord(this.recordId);
              // }
            }

          }


        })
    );
  }

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

  // setTargetSortedRecord(recordId: string) {
  //   // debugger;
  //   const indexR = getIndexBasedId(this.records, recordId);
  //   const indexSor = getIndexBasedId(this.sortedOriginalRecords, recordId);
  //   const indexOr = getIndexBasedId(this.originalRecords, recordId);
  //   this.records[indexR] = JSON.parse(JSON.stringify(this.originalRecords[indexOr]));
  //   this.sortedOriginalRecords[indexSor] = JSON.parse(JSON.stringify(this.originalRecords[indexOr]));
  // }

  // setTargetRecord(recordId: string) {
  //   // debugger;
  //   const indexR = getIndexBasedId(this.records, recordId);
  //   const indexSor = getIndexBasedId(this.sortedOriginalRecords, recordId);
  //   this.records[indexR] = JSON.parse(JSON.stringify(this.sortedOriginalRecords[indexSor]));
  // }

  setPagesRecords() {
    // debugger;
    this.tableMode = '';
    this.pages = new Array(Math.ceil(this.totalRecords / this.recordsPerPage));
    this.triggerTableLoad();
    // this.pages = new Array(Math.ceil(this.sortedOriginalRecords.length / this.itemsPerPage));
    // this.records = this.sortedOriginalRecords.slice(this.activePage * this.itemsPerPage, this.activePage * this.itemsPerPage + this.itemsPerPage);
  }

  jumpToPage(page: number): void {
    // debugger;
    this.activePage = page;
    this.setPagesRecords();
  }

  previousPage() {
    // debugger;
    if (this.activePage >= 1) {
      this.activePage--;
      this.setPagesRecords();
    }
  }

  nextPage() {
    // debugger;
    if (this.activePage < this.pages.length - 1) {
      this.activePage++;
      this.setPagesRecords();
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

    const url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
    this.store.dispatch(new RecordsLoad(url));
  }

  // triggerOpenViewEditDialog(item: any) {
  //   // debugger;
  //   this.recordId = item.id;
  //   this.tableMode = 'load';
  //   this.triggerTableRecordLoad(this.origin, this.tableRecordEndPoint, item.id);
  // }

  openViewEditDialog(id: string) {
    // debugger;
    this.dialogAction = '';
    const recordDetail = getItemBasedId(this.records, id);
    this.dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'view-edit-dialog-class',
      id: `view-edit-dialog-id-${id}`,
      // width: '800px',
      // height: '300px',
      data: {
        title: 'Details dialog View/Edit',
        details: {
          firstname: recordDetail?.data?.firstname,
          surname: recordDetail?.data?.surname,
          age: recordDetail?.data?.age,
          details: recordDetail?.data?.details,
          id: recordDetail?.data?.id
        },
        mode: 'view'
      }
    });

    this.dialogRef.beforeClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;
      // this.recordId = '';
      if (this.dialogAction === 'submitBtn') {
        this.tableMode = 'save';
      }

    });

    this.dialogRef.afterClosed().subscribe(result => {
      // debugger;
      console.log(`Dialog result: ${result}`);
      this.dialogAction = result;
      // this.recordId = '';
      if (this.dialogAction === 'submitBtn') {
        this.tableMode = 'save';
      }
    });
  }

  switchToEditMode(item: any) {
    this.recordId = item.id;
    this.tableMode = 'edit';
    item.edit = true;
  }

  switchToReadMode(item: any) {
    this.recordId = item.id;
    this.tableMode = 'read';
    item.edit = false;
  }

  removeItem(item: any) {

  }

  onInputChange(item: any, index: number) {
    debugger;
    const itemId = this.records[index]?.id;
    const recordItemChanged = this.recordsItemChanged(this.records[index], this.originalRecords[index]);
    if (recordItemChanged) {
      if (this.recordsDiffArrObj === null) {
        this.recordsDiffArrObj = {};
      }
      const temp = JSON.parse(JSON.stringify((this.recordsDiffArrObj)));
      temp[itemId] = this.records[index];
      this.recordsDiffArrObj = {...this.recordsDiffArrObj, ...temp};
    } else {
      delete this.recordsDiffArrObj[itemId];
    }
    if (JSON.stringify(this.recordsDiffArrObj) === '{}') {
      this.recordsDiffArrObj = null;
    }
  }

  recordsItemChanged(recordsItem, originalRecordsItem) {
    debugger;
    const record = this.getSetPropertyByValue(JSON.parse(JSON.stringify(recordsItem)), 'edit', false);
    const originalRecord = this.getSetPropertyByValue(JSON.parse(JSON.stringify(originalRecordsItem)), 'edit', false);
    if (JSON.stringify(record) != JSON.stringify(originalRecord)) {
      return true;
    }
    return false;
  }

  saveChanges() {
    debugger;
    // let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    // let httpOptions = {
    //   headers, withCredentials: false
    // };
    if (this.recordsDiffArrObj) {
      const url = `${this.origin}${this.tableDataEndPoint}`;
      const records = this.getSetArrPropertyByValue(JSON.parse(JSON.stringify(this.records)), 'edit', 'remove');
      const modified = {};
      for (const key in this.recordsDiffArrObj) {
        modified[key] = this.getSetPropertyByValue(JSON.parse(JSON.stringify(this.recordsDiffArrObj[key])), 'edit', 'remove');
      }
      this.store.dispatch(new RecordsSave({endPoint: url, records, modified}));

      this.recordsDiffArrObj = null;

      // const record1 = { id: 'id1', firstname: 'jopo11', lastname: 'popo11', age: 10 };
      // const record2 = { id: 'id2', firstname: 'jopo22', lastname: 'popo22', age: 10 };
      // return this.httpClient.put<any>(url, record1, httpOptions)
      // .pipe(
      //   // retry(3),
      //   catchError(
      //     err => {

      //       throw err;
      //     }
      //   )
      // ).subscribe(
      //   res => {
      //     debugger;
      //   }
      // );
      // const arrObs = [
      //   this.httpBase.putCommon(`${url}/id1`, record1),
      //   this.httpBase.putCommon(`${url}/id2`, record2)
      // ];
      // this.httpBase.putCommon(`${url}/id1`, record1)
      // this.httpBase.putCommon(`${url}/id2`, record2)
      // zip(...arrObs)
      // .pipe(
      //   map((res: any) => {
      //     debugger;
      //     return '';
      //   }),
      //   catchError(error => {
      //     debugger;
      //     return '';
      //   })
      // )

      // .subscribe(
      //   res => {
      //     debugger;
      //    }
      // );
    }
  }

  globalSearch() {
    this.isSearching = true;
    this.searchTextChanged.next(this.globalFilter);
  }

  clearAllFilters() {
    // debugger;
    this.globalFilter = '';
    this.globalSearch();
  }

  processGlobalSearch() {
    debugger;
    this.subscription.add(
      this.searchTextChanged.pipe(debounceTime(1000)).subscribe(
        response => {
          debugger;
          this.isSearching = false;
          const res = response.trim();
          if (res) {
            if (this.searchMode === 'global') {
              const url = `${this.origin}${this.tableDataEndPoint}?q=${res}&_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
              this.store.dispatch(new RecordsLoad(url));
              // this.sortedOriginalRecords = this.getFilteredRecords(this.originalRecords, res);
              // this.sortBy = '';
              // this.activePage = 0;
              // this.sortByColumn(this.sortBy);
              // this.setPagesRecords();
            }
            // const url = `${this.origin}${this.tableDataEndPoint}`;
            // this.store.dispatch(new RecordsLoad(url));
          } else {
            if (this.searchMode === 'global') {
              const url = `${this.origin}${this.tableDataEndPoint}?_page=${this.activePage + 1}&_limit=${this.recordsPerPage}`;
              this.store.dispatch(new RecordsLoad(url));
              // this.activePage = 0;
              // this.sortedOriginalRecords = JSON.parse(JSON.stringify(this.originalRecords));
              // this.setPagesRecords();
            }
            // const url = `${this.origin}${this.tableDataEndPoint}`;
            // this.store.dispatch(new RecordsLoad(url));
          }
          this.searchMode = 'global';
        },
        error => {
          this.isSearching = false;
          throw error;
        }
      ));
  }

  getFilteredRecords(records: any[], propertyValue: string) {
    return records.filter(item => item.firstname.indexOf(propertyValue) > -1 || item.surname.indexOf(propertyValue) > -1 || item.age.indexOf(propertyValue) > -1);
  }


}
