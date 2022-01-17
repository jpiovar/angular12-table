import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/state';
import { StopSpinner } from 'src/app/state/spinner/spinner.actions';

@Component({
  selector: 'app-table-completed',
  templateUrl: './table-completed.component.html',
  styleUrls: ['./table-completed.component.scss']
})
export class TableCompletedComponent implements OnInit, OnChanges, OnDestroy {
  subscription: Subscription = new Subscription();

  @Input() completedRecords: any[] = [];

  messageCompleted: string = 'New record added successfully';

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subscription.add(

      this.store.select('records')
        // .pipe(last())
        .subscribe((res: any) => {
          debugger;

          this.store.dispatch(new StopSpinner());

          if (res && !res.loading) {
            // debugger;
            if (res?.error) {
              this.messageCompleted = 'New record added failed';
              console.log('New record added failed ', res.error);
            }

          }


        })

    );
  }

  ngOnChanges(): void {
    this.completedRecords;
    debugger;
    // this.triggerTableLoad();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
