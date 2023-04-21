import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReminderModule } from './modules/reminder/reminder.module';

const routes: Routes = [
  {
    path: '', redirectTo: 'sign-in', pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then((m) => m.SignInModule)
  },
  {
    path: 'patient',
    loadChildren: () => import('./modules/patient/patient.module').then((m) => m.PatientModule)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./modules/doctor/doctor.module').then((m) => m.DoctorModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./modules/auth/sign-up/sign-up.module').then((m) => m.SignUpModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./modules/appointment/appointment.module').then((m) => AppointmentModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./modules/chat/chat.module').then((m) => ChatModule)
  },
  {
    path: 'reminder',
    loadChildren: () => import('./modules/reminder/reminder.module').then((m) => ReminderModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
