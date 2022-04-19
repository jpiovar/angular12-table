import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HamburgerButtonComponent } from './components/hamburger-button/hamburger-button.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { DialogModule } from './modules/dialog/dialog.module';
import { ButtonModule } from './modules/button/button.module';
import { LogoModule } from './modules/logo/logo.module';
import { InformationModule } from './modules/information/information.module';

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
    ButtonModule,
    // InformationModule
    // LogoModule
  ],
  exports: [
    // HamburgerButtonComponent,
    SafeHtmlPipe,
    // DialogModule,
    ButtonModule
  ]
})
export class SharedModule { }
