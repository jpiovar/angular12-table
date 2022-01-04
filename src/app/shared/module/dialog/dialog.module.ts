import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogStepperComponent } from './components/dialog-stepper/dialog-stepper.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    DialogComponent,
    DialogStepperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    DialogComponent,
    DialogStepperComponent
  ]
})
export class DialogModule { }
