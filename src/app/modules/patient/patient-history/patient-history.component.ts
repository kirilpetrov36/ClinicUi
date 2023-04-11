import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, finalize, takeUntil } from 'rxjs/operators';
import { DayWeekSchedule } from 'src/app/shared/models/dayweek-schedule.model';
import { PatientScheduleModel } from 'src/app/shared/models/patient-schedule.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { PatientInfoService } from 'src/app/shared/services/patient-info.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit, OnDestroy, AfterViewChecked {

  private readonly unsubscribe$ = new Subject<void>();
  public patientSchedule!: DayWeekSchedule<PatientScheduleModel>[];

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
            console.log(this.patientSchedule);
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

  ngAfterViewChecked(): void {
    this.scrollToElementById(this.closestDate(this.patientSchedule.slice(0)).id);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  scrollToElementById(id: string) {
    const element = this.__getElementById(id);
    this.scrollToElement(element);
  }

  private __getElementById(id: string): HTMLElement {
    const element = document.getElementById(id)!;
    return element;
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({block: "center", behavior: "smooth"});
  }

  private closestDate(schedule: DayWeekSchedule<PatientScheduleModel>[]): DayWeekSchedule<PatientScheduleModel> {
    var today = new Date();
    const closestDate = schedule.sort(function(a, b) {
      var distancea = Math.abs(today.getTime() - new Date(a.todaySchedule[0].date).getTime());
      var distanceb = Math.abs(today.getTime() - new Date(b.todaySchedule[0].date).getTime());
      return distancea - distanceb; // sort a before b when the distance is smaller
    });

    return closestDate[0];
  }

  public ifTodayElement(date: Date): boolean{
    return new Date().getDate() === new Date(date).getDate();
  }

}
