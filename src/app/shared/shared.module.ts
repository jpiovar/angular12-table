import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HamburgerButtonComponent } from './components/hamburger-button/hamburger-button.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { DialogModule } from './module/dialog/dialog.module';
import { ButtonModule } from './module/button/button.module';

@NgModule({
  declarations: [
    // HamburgerButtonComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    // DialogModule,
    ButtonModule
  ],
  exports: [
    // HamburgerButtonComponent,
    SafeHtmlPipe,
    // DialogModule,
    ButtonModule
  ]
})
export class SharedModule { }
