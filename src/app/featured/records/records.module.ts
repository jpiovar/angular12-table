import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { TableComponent } from './containers/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from 'src/app/core/services/moment.date.formatter';


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
  ],
  providers: [
    {provide: NgbDateParserFormatter, useValue: new MomentDateFormatter()}
   ]
})
export class RecordsModule { }
