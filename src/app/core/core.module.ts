import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { ToastrComponent } from './components/toastr/toastr.component';

import { MaterialModule } from '../material.module';

import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SpinnerComponent,
    ToastrComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    SpinnerComponent,
    ToastrComponent
  ]
})
export class CoreModule { }
