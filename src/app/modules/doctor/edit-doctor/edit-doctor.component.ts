import {Component, OnDestroy, OnInit} from '@angular/core';
import {DoctorService} from "../../../shared/services/doctor.service";
import {LoaderService} from "../../../shared/services/loader.service";
import {DoctorInfoModel} from "../../../shared/models/doctor-info.model";
import {Subject} from "rxjs";
import {finalize, map, takeUntil} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";
import {Location} from "@angular/common";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {UpdateDoctorInfoModel} from "../../../shared/models/update-doctor-info.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss']
})
export class EditDoctorComponent implements OnInit, OnDestroy {

  public doctorInfo!: DoctorInfoModel;
  private unsubscribe$ = new Subject<void>();
  public isImageExist: boolean = false;
  public imageUrl!: string;
  public selectedFile!: File;
  public selectedFileCreated: boolean = false;
  public selectedFileUrl!: string | ArrayBuffer | null;
  public isLoaded: boolean = false;
  public firstNameControl: FormControl = this.formBuilder.control('', [Validators.required, Validators.minLength(5)]);
  public lastNameControl: FormControl = this.formBuilder.control('', [Validators.required, Validators.minLength(5)]);
  public emailControl: FormControl = this.formBuilder.control('', [Validators.required]);
  public fileControl: FormControl = this.formBuilder.control('');
  public isViewMode: boolean = false;

  constructor(
    private readonly doctorService: DoctorService,
    private readonly loaderService: LoaderService,
    private sanitizer: DomSanitizer,
    public location: Location,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader()

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params['id'] === 'self') {
        this.doctorService.getDoctorInfo()
          .pipe(
            takeUntil(this.unsubscribe$),
            finalize(() => {
              this.isLoaded = true;
              this.loaderService.hideLoader();
            }),
            map(data => {
              if(data.imageUrl){
                this.isImageExist = true;
                this.imageUrl = data.imageUrl
              }
              this.doctorInfo = data;
              this.fillForm(data);
            })
          )
          .subscribe()
      }
      else{
        this.isViewMode = true;

        this.doctorService.getDoctorInfoById(params['id'])
          .pipe(
            takeUntil(this.unsubscribe$),
            finalize(() => {
              this.isLoaded = true;
              this.loaderService.hideLoader();
            }),
            map(data => {
              if(data.imageUrl){
                this.isImageExist = true;
                this.imageUrl = data.imageUrl
              }
              this.doctorInfo = data;
              this.fillForm(data);
            })
          )
          .subscribe()

        this.firstNameControl.disable();
        this.lastNameControl.disable();
        this.emailControl.disable();
        this.fileControl.disable();
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fillForm(data: DoctorInfoModel): void {
    this.firstNameControl.patchValue(data.firstName);
    this.lastNameControl.patchValue(data.lastName);
    this.emailControl.patchValue(data.email)
  }

  public onFileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileCreated = true;

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.selectedFileUrl = reader.result;
    }

    this.loaderService.showLoader();
    this.doctorService.updateDoctorImage(event.target.files[0])
      .pipe(
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        // () => this.router.navigate(['/routes'])
        () => console.log("success")
      )
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public save(): void {
    if (this.firstNameControl.invalid) {
      this.firstNameControl.markAllAsTouched();
      return;
    }

    if (this.lastNameControl.invalid) {
      this.firstNameControl.markAllAsTouched();
      return;
    }

    if (this.emailControl.invalid) {
      this.firstNameControl.markAllAsTouched();
      return;
    }
    this.loaderService.showLoader();


    const  updateModel: UpdateDoctorInfoModel = {
      firstName: this.firstNameControl.value,
      lastName: this.lastNameControl.value,
      email: this.emailControl.value
    }

    this.doctorService.updateDoctorInfo(updateModel)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        () => this.router.navigate(['/doctor/schedule'])
      )
  }

}
