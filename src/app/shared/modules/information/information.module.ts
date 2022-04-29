import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideInfoComponent } from './components/side-info/side-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/material.module';
import { BreakOnPipe } from '../../pipes/break.pipe';
import { nl2brPipe } from '../../pipes/nl2br.pipe';



@NgModule({
  declarations: [
    SideInfoComponent,
    BreakOnPipe,
    nl2brPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule
  ],
  providers: [
    BreakOnPipe,
    nl2brPipe
  ],
  exports: [
    SideInfoComponent,
    BreakOnPipe,
    nl2brPipe
  ]
})
export class InformationModule { }
