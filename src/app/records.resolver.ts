import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, filter, first, map, tap } from 'rxjs/operators';
import { AppState } from './state';
import { StartSpinner, StopSpinner } from './state/spinner/spinner.actions';

@Injectable({
  providedIn: 'root'
})
export class RecordsResolver implements Resolve<boolean|any> {
  constructor(private store: Store<AppState>) {
    // this.store.dispatch(new StartSpinner());
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|any> {
    // return of(true).pipe(delay(2000));
    this.store.dispatch(new StartSpinner());
    return this.store.pipe(
      select('user'),
      tap(state => {
        // debugger;
        console.log('resolver tap user state ', state);
      }),
      filter(state => state && state.accessToken !== null),
      map(state => {
        // debugger;
        console.log('resolver map user state ', state);
        // this.store.dispatch(new StopSpinner());
        return state;
      }),
      first()
    );
  }
}
