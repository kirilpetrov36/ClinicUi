import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/components/shared.module';
import { ReminderComponent } from './reminder.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

const routes: Routes = [
  {
    path: ':id',
    component: ReminderComponent
  },
];

@NgModule({
  declarations: [
    ReminderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    NgxMatTimepickerModule
  ]
})
export class ReminderModule { }
