import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ReminderService } from 'src/app/shared/services/reminder.service';
import { ReadUserReminderModel } from "../../shared/models/read-user-reminder.models";

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();
  public patientId!: string;
  public userReminds!: ReadUserReminderModel;
  public textControl: FormControl = this.formBuilder.control('');
  public remindTimesArray: FormArray = this.formBuilder.array([]);

  constructor(
    private readonly loaderService : LoaderService,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly reminderService: ReminderService
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();

    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        this.patientId = params['id'];
        this.reminderService.getUserReminders(params['id'])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(data => {
            this.userReminds = data;
          })
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public addTime(): void{

  }

}
