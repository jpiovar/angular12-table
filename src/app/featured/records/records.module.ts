import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { TableComponent } from './containers/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    SharedModule,
    MaterialModule,
    RecordsRoutingModule,
    FormsModule
  ]
})
export class RecordsModule { }
