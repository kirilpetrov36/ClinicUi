import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/components/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { DoctorScheduleComponent } from './doctor-schedule/doctor-schedule.component';

import { SchedulerModule } from '@progress/kendo-angular-scheduler';

const routes: Routes = [
  {
    path: 'schedule',
    component: DoctorScheduleComponent
  }
];

@NgModule({
  declarations: [
    DoctorScheduleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    SchedulerModule
  ]
})
export class DoctorModule { }
