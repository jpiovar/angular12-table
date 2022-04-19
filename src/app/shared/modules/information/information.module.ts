import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideInfoComponent } from './components/side-info/side-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [
    SideInfoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule
  ],
  exports: [
    SideInfoComponent
  ]
})
export class InformationModule { }
