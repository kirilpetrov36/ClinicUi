import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil, tap } from 'rxjs/operators';
import { PatientInfoModel } from 'src/app/shared/models/patient-info.model';
import { updatePatientInfoModel } from 'src/app/shared/models/update-patient-info.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { PatientInfoService } from 'src/app/shared/services/patient-info.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientSomeInfoModel } from "../../shared/models/patient-some-info.model";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit , OnDestroy{

  public form!: FormGroup;
  private readonly unsubscribe$ = new Subject<void>();
  public patientInfoModel!: PatientInfoModel;
  public patientId!: string;
  public isViewMode: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private readonly patientInfoService: PatientInfoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.loaderService.showLoader();
    this.createForm();

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.patientId = params['id'];
      this.patientInfoService.getPatientInfo(params['id'])
      .pipe(
        map(
          model => {
            this.patientInfoModel = model;
          }
        ),
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => {
          this.fillForm();
          this.cd.detectChanges();
        },
        () => this.snackBar.open('Something went wrong!', 'OK')
      )
    });

    if (this.router.url.includes('view')) {
      this.isViewMode = true;
      this.form.disable();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private createForm(): void{
    this.form = this.formBuilder.group({
      diagnosis: this.formBuilder.control(''),
      analyses: this.formBuilder.control(''),
      treatment: this.formBuilder.control('')
    })
  }

  private fillForm(): void {
    this.form.controls['diagnosis'].patchValue(this.patientInfoModel.diagnosis);
    this.form.controls['analyses'].patchValue(this.patientInfoModel.analyses);
    this.form.controls['treatment'].patchValue(this.patientInfoModel.treatment);
  }

  public submit(){
    this.loaderService.showLoader();

    const updatePatientInfoModel: updatePatientInfoModel = {
      diagnosis: this.form.controls['diagnosis'].value,
      analyses: this.form.controls['analyses'].value,
      treatment: this.form.controls['treatment'].value,
      patientId: this.patientId
    }

    this.patientInfoService.updatePatientInfo(updatePatientInfoModel)
      .pipe(
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        // () => this.router.navigate(['/routes'])
        () => console.log("success")
      )
  }

  openDialog(data: PatientSomeInfoModel[]): void {
    const dialogRef = this.dialog.open(PatientInfoHistoryComponent, {
      data: data,
    });
  }

  public showDiagnosis(): void {
    this.loaderService.showLoader()
    this.patientInfoService.getPatientDiagnosis(this.patientId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
        tap(data => {
          this.openDialog(data);
        })
      )
      .subscribe();
  }

  public showAnalyses(): void {
      this.loaderService.showLoader()
      this.patientInfoService.getPatientAnalyses(this.patientId)
          .pipe(
              takeUntil(this.unsubscribe$),
              finalize(() => this.loaderService.hideLoader()),
              tap(data => {
                  this.openDialog(data);
              })
          )
          .subscribe();
  }

  public showTherapy(): void{
    this.loaderService.showLoader()
    this.patientInfoService.getPatientTreatments(this.patientId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
        tap(data => {
          this.openDialog(data);
        })
      )
      .subscribe();
  }
}

@Component({
  selector: 'patient-info-history',
  templateUrl: 'patient-info-history.html',
  styleUrls: ['./patient-info-history.scss']
})
export class PatientInfoHistoryComponent {
  constructor(
    public dialogRef: MatDialogRef<PatientInfoHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientSomeInfoModel[],
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

