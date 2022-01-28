import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogStepperComponent } from './components/dialog-stepper/dialog-stepper.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TableModule } from '../table/table.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    DialogComponent,
    DialogStepperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    TableModule,
    NgbModule
  ],
  exports: [
    DialogComponent,
    DialogStepperComponent
  ],
  providers: [
    DatePipe
  ]
})
export class DialogModule { }
