import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../../../state';
import { StopToastr } from 'src/app/state/toastr/toastr.actions';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit, OnDestroy {
  toastr$: boolean = false;
  sizeDetector$: string = '';
  subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private toastr: ToastrService
  ) {
    this.subscription.add(store.select('toastr').subscribe(res => {
      // debugger;
      this.toastr$ = res?.isOn;
      if (this.toastr$) {
        this.openToastr(res?.title, res?.text, res?.duration, res?.type);
      }
    }));
    // this.subscription.add(store.select('sizeDetector').subscribe(({ grid }) => {
    //   // debugger;
    //   this.sizeDetector$ = grid;
    // }));
  }

  getPosition(): string {
    // debugger;
    return (this.sizeDetector$ === 'xs' || this.sizeDetector$ === 'sm') ? 'toast-bottom-center' : 'toast-top-right';
  }

  openToastr(title: string, text: string, duration: number, type: string) {
    // debugger;
    let typeP = 'info';
    if (type) {
      typeP = type;
    }

    this.toastr[typeP](text, undefined, {
      timeOut: duration ? duration : 0,
      positionClass: this.getPosition(),
      preventDuplicates: true,
      newestOnTop: true,
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true
    })
    // .onTap
    .onHidden
    // .onShown
    .pipe(take(1))
    // .subscribe((res: any) => this.toasterClickedHandler(res));
    .subscribe((res: any) => this.toasterHideHandler(res));


      // this.store.dispatch(new StopToastr());

  }

  toasterClickedHandler(res?: any) {
    // debugger;
    console.log('Toastr clicked');
    if (this.toastr &&
      (this.toastr.currentlyActive === 1 || this.toastr.toasts && this.toastr.toasts.length < 2)
    ) {
      this.store.dispatch(new StopToastr());
    }
  }

  toasterHideHandler(res?: any) {
    // debugger;
    console.log('Toastr hidden');
    if (this.toastr &&
      (this.toastr.currentlyActive === 1 || this.toastr.toasts && this.toastr.toasts.length < 2)
    ) {
      this.store.dispatch(new StopToastr());
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
