import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, finalize, takeUntil } from 'rxjs/operators';
import { PatientScheduleModel } from 'src/app/shared/models/patient-schedule.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { PatientInfoService } from 'src/app/shared/services/patient-info.service';
import {SchedulerEvent} from "@progress/kendo-angular-scheduler";

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();
  public patientSchedule!: PatientScheduleModel[];
  public selectedDate: Date = new Date();
  public events!: SchedulerEvent[];

  constructor(
    private readonly loaderService: LoaderService,
    private readonly patientInfoService: PatientInfoService,
    private readonly snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loaderService.showLoader();

    this.patientInfoService.getPatientSchedule()
      .pipe(
        map(
          model => {
            this.patientSchedule = model;
            console.log(model);
            this.events = model.map(dataItem => (
              <SchedulerEvent> {
                id: dataItem.doctorId,
                start: new Date(dataItem.date),
                end: this.endDate(dataItem.date),
                isAllDay: false,
                title: dataItem.doctorFirstName + ' ' + dataItem.doctorLastName
              }
            ));
          }
        ),
        finalize(() => {

          this.loaderService.hideLoader();
        }),
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
    this.router.navigate(['/chat/by-patient', e.event.id]);
  }
}
