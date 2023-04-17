import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { DoctorScheduleModel } from 'src/app/shared/models/doctor-schedule.model';
import { DoctorService } from 'src/app/shared/services/doctor.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.scss']
})
export class DoctorScheduleComponent implements OnInit, OnDestroy {

  public doctorSchedule!: DoctorScheduleModel[];
  private readonly unsubscribe$ = new Subject<void>();
  public selectedDate: Date = new Date();
  public events!: SchedulerEvent[];

  constructor(
    private readonly doctorService: DoctorService,
    private readonly loaderService: LoaderService,
    public readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.loaderService.showLoader();

    this.doctorService.getDoctorSchedule()
      .pipe(
        map(
          model => {
            this.doctorSchedule = model;
            this.events = model.map(dataItem => (
              <SchedulerEvent> {
                id: dataItem.patientId,
                start: new Date(dataItem.date),
                end: this.endDate(dataItem.date),
                isAllDay: false,
                title: dataItem.patientFirstName + ' ' + dataItem.patientLastName
              }
            ));
          }
        ),
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => console.log(),
        () => this.snackBar.open('Something got wrong!', 'OK')
      )
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private endDate(date: Date): Date{
    let newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes()+30);
    return newDate;
  }
  onClick(e: any){
    console.log(e);
    this.router.navigate(['/patient/edit/'+ e.event.id]);
  }
}
