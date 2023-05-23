import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignOutComponent } from './sign-out/sign-out.component';
import { MaterialModule } from '../modules/material.module';
import { MySnackbarComponent } from './my-snackbar/my-snackbar.component';



@NgModule({
  declarations: [
    SignOutComponent,
    MySnackbarComponent
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
