import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadLogoComponent } from './components/head-logo/head-logo.component';



@NgModule({
  declarations: [
    HeadLogoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeadLogoComponent
  ]
})
export class LogoModule { }
