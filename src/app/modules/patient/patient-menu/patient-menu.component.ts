import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { PatientInfoModel } from 'src/app/shared/models/patient-info.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { PatientInfoService } from 'src/app/shared/services/patient-info.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-patient-menu',
  templateUrl: './patient-menu.component.html',
  styleUrls: ['./patient-menu.component.scss']
})
export class PatientMenuComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject<void>();
  public patientInfoModel!: PatientInfoModel;
  public patientId!: string;

  public isImageExist: boolean = false;

  constructor(
    private readonly loaderService: LoaderService,
    private readonly patientInfoService: PatientInfoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.patientId = params['id'];
      this.patientInfoService.getPatientInfo(params['id'])
      .pipe(
        map(
          model => {
            this.patientInfoModel = model;
            //debugger;
              if(model.imageUrl){
                  this.isImageExist = true;
              }
          }
        ),
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => console.log(),
        () => this.snackBar.open('Something went wrong!', 'OK')
      )
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sanitize(url:string){
      return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
