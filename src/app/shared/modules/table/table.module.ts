import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBaseComponent } from './components/table-base/table-base.component';



@NgModule({
  declarations: [
    TableBaseComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TableBaseComponent
  ]
})
export class TableModule { }
