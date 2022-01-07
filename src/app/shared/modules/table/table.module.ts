import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBaseComponent } from './components/table-base/table-base.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { TableBaseExtendedComponent } from './components/table-base-extended/table-base-extended.component';



@NgModule({
  declarations: [
    TableBaseComponent,
    TableBaseExtendedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    TableBaseComponent,
    TableBaseExtendedComponent
  ]
})
export class TableModule { }
