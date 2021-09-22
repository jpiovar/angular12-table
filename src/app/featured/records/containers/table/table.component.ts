import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { compareValues, getIndexBasedId, getItemBasedId } from 'src/app/shared/utils/helper';
import { AppState } from 'src/app/state';
import { MetaLoad, RecordsLoad } from 'src/app/state/records/records.actions';
import { environment } from 'src/environments/environment';
import { compare } from 'natural-orderby';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';

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

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog
  ) {
    this.origin = environment.beOrigin;
    this.tableDataEndPoint = environment.beTableDataEndPoint;
    this.metaDataEndPoint = environment.beMetaDataEndPoint;
    this.tableMode = 'init';
    this.searchMode = 'init';
    this.triggerMetaLoad();
    // this.triggerTableLoad();
    this.tableDataSubscription();
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
    const url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=asc&_page=${this.activePage+1}&_limit=${this.recordsPerPage}`;
    this.store.dispatch(new RecordsLoad(url));
  }

  // triggerTableRecordLoad(origin: string, dataEndPoint: string, id: string): void {
  //   // debugger;
  //   const url = `${origin}${dataEndPoint}/${id}`;
  //   this.store.dispatch(new RecordLoadDetail({ id, detail: url, storeMode: true }));
  // }

  tableDataSubscription() {
    this.subscription.add(
      this.store.select('records')
        // .pipe(last())
        .subscribe((res: any) => {
           debugger;
          if (res && !res.loading && res.totalRecords > 0) {
            if (this.tableMode === 'init') {
              this.totalRecords = res?.totalRecords;
              this.setPagesRecords();
            }
          }
          // else if (res && !res.loading && res.totalRecords === 0) {

          // }
          if (res && !res.loading && res.data) {
            // debugger;
            this.originalRecords = JSON.parse(JSON.stringify(res.data));

            this.records = JSON.parse(JSON.stringify(this.originalRecords));

            this.extendByProperty(this.records, 'edit', false);
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
        })
    );
  }

  extendByProperty(records: any, propertyName: string, propertyValue: any) {
    for (let index = 0; index < records.length; index++) {
      records[index][propertyName] = propertyValue;
    }
  }

  setTargetSortedRecord(recordId: string) {
    // debugger;
    const indexR = getIndexBasedId(this.records, recordId);
    const indexSor = getIndexBasedId(this.sortedOriginalRecords, recordId);
    const indexOr = getIndexBasedId(this.originalRecords, recordId);
    this.records[indexR] = JSON.parse(JSON.stringify(this.originalRecords[indexOr]));
    this.sortedOriginalRecords[indexSor] = JSON.parse(JSON.stringify(this.originalRecords[indexOr]));
  }

  setTargetRecord(recordId: string) {
    // debugger;
    const indexR = getIndexBasedId(this.records, recordId);
    const indexSor = getIndexBasedId(this.sortedOriginalRecords, recordId);
    this.records[indexR] = JSON.parse(JSON.stringify(this.sortedOriginalRecords[indexSor]));
  }

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

    const url = `${this.origin}${this.tableDataEndPoint}?_sort=${this.sortBy}&_order=${this.direction}&_page=${this.activePage+1}&_limit=${this.recordsPerPage}`;
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
              const url = `${this.origin}${this.tableDataEndPoint}?q=${res}&_page=${this.activePage+1}&_limit=${this.recordsPerPage}`;
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
              const url = `${this.origin}${this.tableDataEndPoint}?_page=${this.activePage+1}&_limit=${this.recordsPerPage}`;
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
