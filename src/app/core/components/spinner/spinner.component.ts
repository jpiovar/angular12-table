import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../../../state';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  spinner$: boolean = false;
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {
    this.subscription.add(store.select('spinner').subscribe(res => {
      this.spinner$ = res?.isOn;
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
