import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, flatMap, mergeMap, delay, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, Observer, of, throwError, zip, from } from 'rxjs';

import {
  RECORDS_LOAD,
  RecordsLoad,
  RecordsLoadSuccess,
  RecordsLoadFail,
  // RECORD_SAVE,
  // RecordSave,
  // RecordSaveSuccess,
  // RecordSaveFail,
  // META_LOAD,
  // MetaLoad,
  // MetaLoadSuccess,
  // MetaLoadFail,
  RECORDS_SAVE,
  RecordsSave,
  RecordsSaveSuccess,
  RecordsSaveFail,
  RECORDS_DELETE,
  RecordsDelete,
  RecordsDeleteSuccess,
  RecordsDeleteFail,
  RECORDS_ADD_NEW,
  RecordsAddNew,
  RecordsAddNewSuccess,
  RecordsAddNewFail,
  // CHANGE_LOG_LOAD,
  // ChangeLogLoad,
  // ChangeLogLoadSuccess,
  // ChangeLogLoadFail
} from './records.actions';

import { RecordsState } from './records.models';
import { HttpBaseService } from '../../core/services/http.base.service';
import { environment } from '../../../environments/environment';
import { ajax } from 'rxjs/ajax';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { StartToastr } from '../toastr/toastr.actions';
import { getItemBasedId } from 'src/app/shared/utils/helper';
import { LogsSave } from '../logs/logs.actions';

@Injectable()
export class RecordsEffects {
  origin: string;
  tableLogs: string;
  tableDataEndPoint: string;


  constructor(
    private actions$: Actions<any>,
    private httpBase: HttpBaseService,
    private store: Store<AppState>
  ) {
    this.origin = environment.beOrigin;
    this.tableLogs = environment.beTableChangeLogs;
    this.tableDataEndPoint = environment.beTableDataEndPoint;
  }


  // changeLogLoad$ = createEffect(() => this.actions$.pipe(
  //   ofType(CHANGE_LOG_LOAD),
  //   switchMap(
  //     (action: ChangeLogLoad) => {
  //       debugger;
  //       const urlChangeLog: any = action.payload.url;
  //       const recordId = action.payload.recordId;
  //       return this.httpBase.getCommon(`${urlChangeLog}`).pipe(
  //         map((res: any) => {
  //           debugger;
  //           return new ChangeLogLoadSuccess({recordId, changeLog: res})
  //         }),
  //         catchError(error => {
  //           debugger;
  //           return of(new ChangeLogLoadFail(error));
  //         })
  //       );
  //     }
  //   )
  // )
  // );


  // metaLoad$ = createEffect(() => this.actions$.pipe(
  //   ofType(META_LOAD),
  //   switchMap(
  //     (action: MetaLoad) => {
  //       // debugger;
  //       const urlRecords: any = action.payload;
  //       return this.httpBase.getCommon(`${urlRecords}`).pipe(
  //         map((res: any) => {
  //           // debugger;
  //           return new MetaLoadSuccess(res?.total)
  //         }),
  //         catchError(error => {
  //           // debugger;
  //           return of(new MetaLoadFail(error));
  //         })
  //       );
  //     }
  //   )
  // )
  // );

  // @Effect()
  // recordsLoad$ = this.actions$.pipe(
  recordsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_LOAD),
    switchMap(
      (action: RecordsLoad) => {
        // debugger;
        const urlRecords: any = action.payload;
        return this.httpBase.getCommon(`${urlRecords}`).pipe(
          map((res: any) => {
            // debugger;
            let resExt = res;
            if (!res?.data && !res?.totalRecords) {
              resExt = {
                data: res,
                totalRecords: 12
              };
            }
            return new RecordsLoadSuccess(resExt);
          }),
          catchError(error => {
            // debugger;
            return of(new RecordsLoadFail(error));
          })
        );
      }
    )
  )
  );

  recordsSave$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_SAVE),
    map(
      (action: RecordsSave) => {
        debugger;
        const endPoint: any = action?.payload?.endPoint;
        const records: any = action?.payload?.records;
        const modified: any = action?.payload?.modified;
        const currentUrl: string = action?.payload?.currentUrl;

        // const record1 = { id: 'id1', firstname: 'jopo1', lastname: 'popo1', age: 10 };
        // const record2 = { id: 'id2', firstname: 'jopo2', lastname: 'popo2', age: 10 };
        const arrObs = [];
        for (const key in modified) {
          if (modified.hasOwnProperty(key)) {
            arrObs.push(this.httpBase.putCommon(`${endPoint}/${key}`, modified[key]));
          }
        }
        // [
        //   this.httpBase.putCommon(`${endPoint}/id1`, record1),
        //   this.httpBase.putCommon(`${endPoint}/id2`, record2)
        // ];

        return {
          endPoint, records, arrObs, modified, currentUrl
        };
      }
    ),
    mergeMap(
      (res: any) => {
        return new Observable((observer: Observer<any>) => {
          zip(...res.arrObs).subscribe(
            (subres: any) => {
              debugger;
              return observer.next({
                arrObsRes: subres,
                endPoint: res.endPoint,
                records: res.records,
                modified: res.modified,
                currentUrl: res.currentUrl
              });
            },
            error => throwError(error),
            () => observer.complete()
          );
        });
      }
    ),
    map(
      res => {
        const url = `${this.origin}${this.tableLogs}`;
        debugger;
        const records = JSON.parse(JSON.stringify(res?.records));
        // const itemId = item?.id;
        for (const key in res?.modified) {
          if (res?.modified.hasOwnProperty(key)) {
            this.store.dispatch(new StartToastr({ text: `record ${key} updated`, type: 'success', duration: 5000 }));
          }
        }
        debugger;
        this.store.dispatch(new LogsSave({ endPoint: url, records: res?.records, modified: res?.modified }));

        debugger;
        const urlLoadRecords = res?.currentUrl;
        this.store.dispatch(new RecordsLoad(urlLoadRecords));

        return new RecordsSaveSuccess(records);
      }
    ),
    catchError(error => {
      // debugger;
      // console.log(`${res.endPoint}`, error);
      // const recordId = record.id;
      // this.store.dispatch(new StartToastr({ text: `record ${recordId} did not update`, type: 'error', duration: 5000 }));
      return of(new RecordsSaveFail(error));
    })
  )
  );


  recordsDelete$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_DELETE),
    map(
      (action: RecordsDelete) => {
        // debugger;
        const endPoint: any = action?.payload?.endPoint;
        const records: any = action?.payload?.records;
        const deleted: any = action?.payload?.deleted;

        // const record1 = { id: 'id1', firstname: 'jopo1', lastname: 'popo1', age: 10 };
        // const record2 = { id: 'id2', firstname: 'jopo2', lastname: 'popo2', age: 10 };
        const arrObs = [];
        for (const key in deleted) {
          if (deleted.hasOwnProperty(key)) {
            arrObs.push(this.httpBase.deleteCommon(`${endPoint}/${key}`));
          }
        }
        // [
        //   this.httpBase.putCommon(`${endPoint}/id1`, record1),
        //   this.httpBase.putCommon(`${endPoint}/id2`, record2)
        // ];

        return {
          endPoint, records, arrObs, deleted
        };
      }
    ),
    mergeMap(
      (res: any) => {
        return new Observable((observer: Observer<any>) => {
          zip(...res.arrObs).subscribe(
            (subres: any) => {
              // debugger;
              return observer.next({
                arrObsRes: subres,
                endPoint: res.endPoint,
                records: res.records,
                deleted: res.deleted
              });
            },
            error => throwError(error),
            () => observer.complete()
          );
        });
      }
    ),
    map(
      res => {
        // debugger;
        const records = JSON.parse(JSON.stringify(res?.records));
        const deleted = JSON.parse(JSON.stringify(res.deleted));
        for (let i = 0; i < records.length; i++) {
          if (Object.keys(deleted).indexOf(records[i].id) > -1) {
            records.splice(i, 1);
          }
        }
        for (const key in res?.deleted) {
          if (res?.deleted.hasOwnProperty(key)) {
            this.store.dispatch(new StartToastr({ text: `record ${key} deleted`, type: 'success', duration: 5000 }));
          }
        }
        return new RecordsDeleteSuccess(records);
      }
    ),
    catchError(error => {
      // debugger;
      // console.log(`${res.endPoint}`, error);
      // const recordId = record.id;
      // this.store.dispatch(new StartToastr({ text: `record ${recordId} did not update`, type: 'error', duration: 5000 }));
      return of(new RecordsDeleteFail(error));
    })
  )
  );

  recordsAddNew$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_ADD_NEW),
    switchMap(
      (action: RecordsAddNew) => {
        debugger;
        const endPoint: any = action?.payload?.endPoint;
        const records: any = action?.payload?.records;

          return this.httpBase.postCommon(`${endPoint}`, records[0]).pipe(
            map(
              (response: any) => {
                debugger;
                if (response) {
                  return new RecordsAddNewSuccess();
                }
              }
            ),
            catchError(error => {
              debugger;
              console.log(`${endPoint}`, error);
              return of(new RecordsAddNewFail(error));
            })
          );

      }
    )
  )
  );

  // mergeMap(
  //   (res: any) => {
  //     debugger;


  //     // if (actionType === 'update') {
  //       return this.httpBase.putCommon(`${res.endPoint}/1`, res.records)
  //       .pipe(
  //         map(
  //           (response: any) => {
  //             debugger;
  //             const item = JSON.parse(JSON.stringify(res.records));
  //             const itemId = item?.id;
  //             this.store.dispatch(new StartToastr({ text: `record ${itemId} updated`, type: 'success', duration: 5000 }));
  //             return new RecordsSaveSuccess(res.records);
  //           }
  //         ),
  //         catchError(error => {
  //           debugger;
  //           console.log(`${res.endPoint}`, error);
  //           // const recordId = record.id;
  //           // this.store.dispatch(new StartToastr({ text: `record ${recordId} did not update`, type: 'error', duration: 5000 }));
  //           return of(new RecordsSaveFail(error));
  //         })
  //       );
  //   }
  // )
  // )
  // );


  // @Effect()
  // recordLoadDetails$ = this.actions$.pipe(
  // recordLoadDetails$ = createEffect(() => this.actions$.pipe(
  //   ofType(RECORD_LOAD_DETAIL),
  //   switchMap(
  //     (action: RecordLoadDetail) => {
  //       // debugger;
  //       const urlRecords: any = action.payload.detail;
  //       const id = action.payload.id;
  //       return this.httpBase.getCommon(`${urlRecords}`).pipe(
  //         map(
  //           (response: any) => {
  //             // debugger;
  //             const detail = response;
  //             return new RecordLoadDetailSuccess({ id, detail });
  //           }
  //         ),
  //         catchError(error => {
  //           // debugger;
  //           return of(new RecordLoadDetailFail(error));
  //         })
  //       );
  //     }
  //   )
  // )
  // );


  // recordLoadDetails$ = createEffect(() => this.actions$.pipe(
  //   ofType(RECORD_LOAD_DETAIL),
  //   withLatestFrom(this.store.select('records')),
  //   mergeMap(([action, selector]) => {
  //     // debugger;
  //     const urlRecords: any = action?.payload?.detail;
  //     const id = action?.payload?.id;
  //     const recordsData = selector?.data;
  //     const itemRecord = getItemBasedId(recordsData, id);
  //     if (action?.payload?.storeMode && itemRecord?.data) {
  //       const detail = JSON.parse(JSON.stringify(itemRecord.data));
  //       if (detail['executed']) {
  //         detail['executed']++;
  //       } else {
  //         detail['executed'] = 1;
  //       }
  //       return of(new RecordLoadDetailSuccess({ id, detail }));
  //     }
  //     return this.httpBase.getCommon(`${urlRecords}`).pipe(
  //       map(
  //         (response: any) => {
  //           // debugger;
  //           const detail = response;
  //           return new RecordLoadDetailSuccess({ id, detail });
  //         }
  //       ),
  //       catchError(error => {
  //         // debugger;
  //         return of(new RecordLoadDetailFail(error));
  //       })
  //     );
  //   })
  // ));


  // @Effect()
  // recordSave$ = this.actions$.pipe(
  // recordSave$ = createEffect(() => this.actions$.pipe(
  //   ofType(RECORD_SAVE),
  //   switchMap(
  //     (action: RecordSave) => {
  //       // debugger;
  //       const endPoint: any = action?.payload?.endPoint;
  //       const record: any = action?.payload?.record;
  //       const actionType = action?.payload?.actionType;

  //       if (actionType === 'update') {
  //         return this.httpBase.putCommon(`${endPoint}/${record.id}`, record).pipe(
  //           map(
  //             (response: any) => {
  //               // debugger;
  //               const item = JSON.parse(JSON.stringify(record));
  //               const itemId = item?.id;
  //               this.store.dispatch(new StartToastr({ text: `record ${itemId} updated`, type: 'success', duration: 5000 }));
  //               return new RecordSaveSuccess({ recordRow: item, actionType });
  //             }
  //           ),
  //           catchError(error => {
  //             // debugger;
  //             console.log(`${endPoint}`, error);
  //             const recordId = record.id;
  //             this.store.dispatch(new StartToastr({ text: `record ${recordId} did not update`, type: 'error', duration: 5000 }));
  //             return of(new RecordSaveFail(error));
  //           })
  //         );
  //       }
  //       else if (actionType === 'new') {
  //         return this.httpBase.postCommon(`${endPoint}`, record).pipe(
  //           map(
  //             (response: any) => {
  //               // debugger;
  //               const recRow = JSON.parse(JSON.stringify(record));
  //               if (response && (response?.eventId === recRow.eventId || response?.id === recRow.eventId)) {
  //                 const recordId = recRow?.event?.taxSubjectPerson.companyId || recRow?.event?.taxSubjectPerson.birthCode;
  //                 this.store.dispatch(new StartToastr({ text: `record ${recordId} added`, type: 'success', duration: 5000 }));
  //                 return new RecordSaveSuccess({ recordRow: recRow?.event?.taxSubjectPerson, actionType });
  //               }
  //             }
  //           ),
  //           catchError(error => {
  //             // debugger;
  //             console.log(`${endPoint}`, error);
  //             const recordId = record?.event?.taxSubjectPerson.companyId || record?.event?.taxSubjectPerson.birthCode;
  //             this.store.dispatch(new StartToastr({ text: `record ${recordId} did not add`, type: 'error', duration: 5000 }));
  //             return of(new RecordSaveFail(error));
  //           })
  //         );
  //       }

  //     }
  //   )
  // )
  // );

  randomProcessState(item: any): string {
    const index = Number(item?.fileNumber[item?.fileNumber.length - 1]) || 0;
    const resArr = ['', 'success', 'warning', 'error'];
    return resArr[index % 4];
  }

}
