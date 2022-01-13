import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBaseComponent } from './components/table-base/table-base.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { TableBaseExtendedComponent } from './components/table-base-extended/table-base-extended.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    TableBaseComponent,
    TableBaseExtendedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule
  ],
  exports: [
    TableBaseComponent,
    TableBaseExtendedComponent
  ]
})
export class TableModule { }
