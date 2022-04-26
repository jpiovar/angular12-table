import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.component';
import { LoginComponent } from './containers/login/login.component';
import { LoginBtnComponent } from './components/login-btn/login-btn.component';
import { LogoModule } from 'src/app/shared/modules/logo/logo.module';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    LoginBtnComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    LogoModule
  ]
})
export class HomeModule { }
