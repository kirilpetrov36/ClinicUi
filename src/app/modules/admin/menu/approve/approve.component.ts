import { Component, OnInit } from '@angular/core';
import {UserModel} from "../../../../shared/models/user.model";
import {DoctorService} from "../../../../shared/services/doctor.service";
import {Subject} from "rxjs";
import {finalize, map, takeUntil} from "rxjs/operators";
import {LoaderService} from "../../../../shared/services/loader.service";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {

  public doctors: UserModel[] = []
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly doctorService: DoctorService,
    private readonly loaderService: LoaderService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();

    this.doctorService.getAllDoctors(false)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
        map(model => this.doctors = model)
      )
      .subscribe()
  }

  public approve(doctor: UserModel, value: boolean){
    this.loaderService.showLoader();

    this.authService.approveDoctor(doctor.id, value)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
      )
      .subscribe(
        () => {
          const index = this.doctors.findIndex(p => p.id == doctor.id);
          this.doctors[index].isApproved = value;
        }
      )
  }

}
