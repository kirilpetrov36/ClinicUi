import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignOutComponent } from './sign-out/sign-out.component';
import { MaterialModule } from '../modules/material.module';



@NgModule({
  declarations: [
    SignOutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    SignOutComponent
  ]
})
export class SharedModule { }
