import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  languageParam = { value: 'intro' };
  translation: any;

  constructor(
    private translate: TranslateService
  ) {
    this.translationSubscribe();
  }

  ngOnInit(): void { }

  translationSubscribe() {
    // currently just for example of usage
    // this.subscription.add(
    //   this.translate?.get('MAIN.APP-NAME', this.languageParam).subscribe((res: string) => {
    //     debugger;
    //     console.log('TableComponent', res);
    //   })
    // );

    this.subscription.add(
      this.translate?.get('RECORDS').subscribe(obj => {
        debugger;
        this.translation = obj;
        console.log('TableComponent RECORDS', obj);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
