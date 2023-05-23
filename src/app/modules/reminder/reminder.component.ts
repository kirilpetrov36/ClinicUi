import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ReminderService } from 'src/app/shared/services/reminder.service';
import { ReadUserReminderModel } from "../../shared/models/read-user-reminder.models";
import { CreateUserReminderModel } from "../../shared/models/create-user-reminder.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UpdateUserRemindersModel } from "../../shared/models/update-user-reminder.model";
import {Location} from '@angular/common';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();
  public patientId!: string;
  public isLoaded: boolean = false;
  public userReminds!: ReadUserReminderModel;
  public form: FormGroup = this.formBuilder.group({
    reminds: this.formBuilder.array([])
  })
  public textControl: FormControl = this.formBuilder.control('');
  public createReminder: boolean = false;

  constructor(
    private readonly loaderService : LoaderService,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly reminderService: ReminderService,
    private readonly matSnackbar: MatSnackBar,
    public location: Location
  ) { }

  ngOnInit(): void {
    //this.loaderService.showLoader();
    //this.createForm();

    this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
      )
      .subscribe(params => {
        this.patientId = params['id'];
        this.reminderService.getUserReminders(params['id'])
          .pipe(
            takeUntil(this.unsubscribe$),
            finalize(() => {
              this.loaderService.hideLoader();
            }),
            map(data => {
              this.userReminds = data;
              if(!data){
                this.createReminder = true;
              }
              if(data?.times.length > 0){
                this.fillForm(data)
              }
              else{
                // const dates: string[] = [""];
                // const firstTime: CreateUserReminderModel = {
                //   userId: this.patientId,
                //   text: this.textControl.value,
                //   remindTimes: dates
                // }
                this.remindsArray.push(
                  this.formBuilder.group({
                    time: this.formBuilder.control('')
                  })
                );
              }

            })
          )
          .subscribe(() => {
            this.isLoaded = true;
          })
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public submit(): void {
    this.loaderService.showLoader();

    if(this.createReminder){
      const createReminderModel: CreateUserReminderModel = {
        userId: this.patientId,
        text: this.textControl.value,
        remindTimes: this.timesFromArray()
      }

      this.reminderService.createUserReminder(createReminderModel)
        .pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loaderService.hideLoader())
        )
        .subscribe(
          () => this.router.navigate(['patient/edit/' + this.patientId]),
          () => this.matSnackbar.open('Something went wrong!', 'Ok')
        );
    }else{
      const updateReminderModel: UpdateUserRemindersModel = {
        id: this.userReminds.id,
        text: this.textControl.value,
        times: this.timesFromArray()
      }

      this.reminderService.updateUserReminders(updateReminderModel)
        .pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loaderService.hideLoader())
        )
        .subscribe(
          () => this.router.navigate(['patient/edit/' + this.patientId]),
          () => this.matSnackbar.open('Something went wrong!', 'Ok')
        );
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      reminds: this.formBuilder.array([])
    });
  }

  private fillForm(data: ReadUserReminderModel): void {
    if(data){
      data.times.forEach((value, index) => {
        this.remindsArray.push(
          this.formBuilder.group({
            time: this.formBuilder.control('')
          })
        );
        (this.remindsArray.get(index.toString()) as FormGroup).controls['time'].patchValue(value.toString().slice(0, 5))
      });

      if(data.text){
        this.textControl.patchValue(data.text);
      }

    }
  }

  public getTimeControl(index: number): FormControl {
    const group = this.remindsArray.get(index.toString()) as FormGroup;
    return group.controls['time'] as FormControl;
  }

  public addTime(): void{
    if (this.remindsArray.length > 4){
      return;
    }
    this.remindsArray.push(
      this.formBuilder.group({
        time: this.formBuilder.control('')
      })
    )
  }

  public removeTime(index: number): void {
    this.remindsArray.removeAt(index);
  }

  get remindsArray(): FormArray {
    return this.form.controls['reminds'] as FormArray;
  }

  public timesFromArray(): string[] {
    let times: string[] = [];
    this.remindsArray.controls.forEach(timeGroup => {
      times.push((timeGroup as FormGroup).controls['time'].value.toString())
    })

    return times;
  }
}
