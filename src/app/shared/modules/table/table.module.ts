import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBaseComponent } from './components/table-base/table-base.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TableBaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    TableBaseComponent
  ]
})
export class TableModule { }
