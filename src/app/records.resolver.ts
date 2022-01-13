import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, filter, first, map, tap } from 'rxjs/operators';
import { AppState } from './state';

@Injectable({
  providedIn: 'root'
})
export class RecordsResolver implements Resolve<boolean|any> {
  constructor(private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|any> {
    // return of(true).pipe(delay(2000));
    return this.store.pipe(
      select('user'),
      tap(state => {
        // debugger;
        console.log('state', state);
      }),
      filter(state => state && state.accessToken !== null),
      map(state => {
        // debugger;
        return state;
      }),
      first()
    );
  }
}
