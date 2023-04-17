import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import {PatientComponent, PatientInfoHistoryComponent} from './patient.component';
import { PatientMenuComponent } from './patient-menu/patient-menu.component';
import { SharedModule } from 'src/app/shared/components/shared.module';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import {
    MonthViewModule,
    MultiDayViewModule,
    SchedulerModule,
    TimelineViewModule
} from "@progress/kendo-angular-scheduler";

const routes: Routes = [
  {
    path: 'edit/:id',
    component: PatientComponent
  },
  {
    path: 'view/:id',
    component: PatientComponent
  },
  {
    path: 'menu/:id',
    component: PatientMenuComponent
  },
  {
    path: 'history',
    component: PatientHistoryComponent
  }
];

@NgModule({
  declarations: [
    PatientComponent,
    PatientMenuComponent,
    PatientHistoryComponent,
    PatientInfoHistoryComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        MonthViewModule,
        MultiDayViewModule,
        SchedulerModule,
        TimelineViewModule
    ]
})
export class PatientModule { }
