import { Component, OnInit } from '@angular/core';
import {DoctorScheduleModel} from "../../../shared/models/doctor-schedule.model";
import {Subject} from "rxjs";
import {DoctorService} from "../../../shared/services/doctor.service";
import {LoaderService} from "../../../shared/services/loader.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize, map, takeUntil} from "rxjs/operators";
import {Location} from '@angular/common';

@Component({
  selector: 'app-doctor-table',
  templateUrl: './doctor-table.component.html',
  styleUrls: ['./doctor-table.component.scss']
})
export class DoctorTableComponent implements OnInit {

  public doctorSchedule!: DoctorScheduleModel[];
  private readonly unsubscribe$ = new Subject<void>();
  public displayedColumns: string[] = ['id', 'name', 'time'];

  constructor(
    private readonly doctorService: DoctorService,
    private readonly loaderService: LoaderService,
    public readonly router: Router,
    private readonly snackBar: MatSnackBar,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.doctorService.getActualDoctorSchedule()
      .pipe(
        map(
          model => {
            this.doctorSchedule = model;
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

  openPatient(patientId: any){
    this.router.navigate(['/patient/edit/'+ patientId]);
  }

}
