import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { TableComponent } from './containers/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from 'src/app/core/services/moment.date.formatter';
import { CustomDatepickerI18n, I18n } from 'src/app/core/services/i18n.sk';
import { NgbDatepickerI18nTitleDirective } from 'src/app/core/directives/datepicker.title.directive';
import { LogoutBtnComponent } from './components/logout-btn/logout-btn.component';
import { TableExtendedComponent } from './components/table-extended/table-extended.component';
import { TableBaseComponent } from './components/table-base/table-base.component';


@NgModule({
  declarations: [
    TableComponent,
    NgbDatepickerI18nTitleDirective,
    LogoutBtnComponent,
    TableExtendedComponent,
    TableBaseComponent
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
    I18n,
    {provide: NgbDateParserFormatter, useValue: new MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
   ]
})
export class RecordsModule { }
