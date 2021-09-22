import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, flatMap, mergeMap, delay, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, Observer, of, throwError, zip } from 'rxjs';

import {
  RECORDS_LOAD,
  RecordsLoad,
  RecordsLoadSuccess,
  RecordsLoadFail,
  RECORD_SAVE,
  RecordSave,
  RecordSaveSuccess,
  RecordSaveFail,
  META_LOAD,
  MetaLoad,
  MetaLoadSuccess,
  MetaLoadFail
} from './records.actions';

import { RecordsState } from './records.models';
import { HttpBaseService } from '../../core/services/http.base.service';
import { environment } from '../../../environments/environment';
import { ajax } from 'rxjs/ajax';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { StartToastr } from '../toastr/toastr.actions';
import { getItemBasedId } from 'src/app/shared/utils/helper';

@Injectable()
export class RecordsEffects {

  constructor(
    private actions$: Actions<any>,
    private httpBase: HttpBaseService,
    private store: Store<AppState>
  ) {
    this.origin = environment.beOrigin;
  }
  origin: string;

  metaLoad$ = createEffect(() => this.actions$.pipe(
    ofType(META_LOAD),
    switchMap(
      (action: MetaLoad) => {
        // debugger;
        const urlRecords: any = action.payload;
        return this.httpBase.getCommon(`${urlRecords}`).pipe(
          map((res: any) => {
            // debugger;
            return new MetaLoadSuccess(res?.total)
          }),
          catchError(error => {
            // debugger;
            return of(new MetaLoadFail(error));
          })
        );
      }
    )
  )
  );

  // @Effect()
  // recordsLoad$ = this.actions$.pipe(
  recordsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_LOAD),
    switchMap(
      (action: RecordsLoad) => {
        // debugger;
        const urlRecords: any = action.payload;
        return this.httpBase.getCommon(`${urlRecords}`).pipe(
          map((res: any) => new RecordsLoadSuccess(res)),
          catchError(error => {
            // debugger;
            return of(new RecordsLoadFail(error));
          })
        );
      }
    )
  )
  );

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
  recordSave$ = createEffect(() => this.actions$.pipe(
    ofType(RECORD_SAVE),
    switchMap(
      (action: RecordSave) => {
        // debugger;
        const endPoint: any = action?.payload?.endPoint;
        const record: any = action?.payload?.record;
        const actionType = action?.payload?.actionType;

        if (actionType === 'update') {
          return this.httpBase.putCommon(`${endPoint}/${record.id}`, record).pipe(
            map(
              (response: any) => {
                // debugger;
                const item = JSON.parse(JSON.stringify(record));
                const itemId = item?.id;
                this.store.dispatch(new StartToastr({ text: `record ${itemId} updated`, type: 'success', duration: 5000 }));
                return new RecordSaveSuccess({ recordRow: item, actionType });
              }
            ),
            catchError(error => {
              // debugger;
              console.log(`${endPoint}`, error);
              const recordId = record.id;
              this.store.dispatch(new StartToastr({ text: `record ${recordId} did not update`, type: 'error', duration: 5000 }));
              return of(new RecordSaveFail(error));
            })
          );
        }
        else if (actionType === 'new') {
          return this.httpBase.postCommon(`${endPoint}`, record).pipe(
            map(
              (response: any) => {
                // debugger;
                const recRow = JSON.parse(JSON.stringify(record));
                if (response && (response?.eventId === recRow.eventId || response?.id === recRow.eventId)) {
                  const recordId = recRow?.event?.taxSubjectPerson.companyId || recRow?.event?.taxSubjectPerson.birthCode;
                  this.store.dispatch(new StartToastr({ text: `record ${recordId} added`, type: 'success', duration: 5000 }));
                  return new RecordSaveSuccess({ recordRow: recRow?.event?.taxSubjectPerson, actionType });
                }
              }
            ),
            catchError(error => {
              // debugger;
              console.log(`${endPoint}`, error);
              const recordId = record?.event?.taxSubjectPerson.companyId || record?.event?.taxSubjectPerson.birthCode;
              this.store.dispatch(new StartToastr({ text: `record ${recordId} did not add`, type: 'error', duration: 5000 }));
              return of(new RecordSaveFail(error));
            })
          );
        }

      }
    )
  )
  );

  randomProcessState(item: any): string {
    const index = Number(item?.fileNumber[item?.fileNumber.length - 1]) || 0;
    const resArr = ['', 'success', 'warning', 'error'];
    return resArr[index % 4];
  }

}
