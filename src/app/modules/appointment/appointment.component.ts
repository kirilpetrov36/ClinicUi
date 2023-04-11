import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { concatMap, debounceTime, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { ScheduleModel } from 'src/app/shared/models/schedule.model';
import { UserModel } from 'src/app/shared/models/user.model';
import { DoctorService } from 'src/app/shared/services/doctor.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit, OnDestroy {

  public doctorsControl: FormControl = this.formBuilder.control('');
  public dateControl: FormControl = this.formBuilder.control('');
  public choosenTime: FormControl = this.formBuilder.control('');
  private readonly unsubscribe$ = new Subject<void>();
  public doctors!: UserModel[];
  public patientId!: string;
  public availableTimes!: string[];

  constructor(
    private readonly loaderService: LoaderService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader()

    this.doctorService.getAllDoctors()
      .pipe(
        map(data => {
          this.doctors = data;
        }),
        takeUntil(this.unsubscribe$),
        finalize( () => this.loaderService.hideLoader())
      )
      .subscribe()

      this.activatedRoute.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(params => this.patientId = params['id'])

      this.dateControl.valueChanges
        .pipe(
          debounceTime(300),
          takeUntil(this.unsubscribe$),
          concatMap(val => {
            const date = new Date(val);
            date.setHours(date.getHours()+24);
            const isoString = date.toISOString();
            return this.doctorService.getDoctorScheduleByDate(this.doctorsControl.value, isoString)
            }),
          tap(val => {
            if(val){
              this.choosenTime.enable();
            }
            else{
              this.choosenTime.disable();
            }
          })
        )
        .subscribe(res => {
          this.availableTimes = res
        });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submit(): void {

    this.loaderService.showLoader();

    let date = new Date(this.dateControl.value);
    date.setHours(date.getHours() + 24)

    const scheduleModel: ScheduleModel = {
      doctorId: this.doctorsControl.value,
      date: date.toISOString(),
      time: this.choosenTime.value
    }

    this.doctorService.createSchedule(scheduleModel)
      .pipe(
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () =>  this.router.navigate(['/patient/menu', this.patientId]),
        () => this.snackBar.open('This time is taken', 'OK')
      );
  }
}
