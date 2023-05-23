import { Component, OnDestroy, OnInit } from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { SignUpModel } from 'src/app/shared/models/sign-up.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import {DoctorTypeModel} from "../../../shared/models/doctor-type.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public selectedFile!: File;
  public selectedFileCreated: boolean = false;
  public selectedFileUrl!: string | ArrayBuffer | null;
  public imageTouched: boolean = false;

  private readonly unsubscribe$ = new Subject<void>();
  public roles: string[] = ['Doctor', 'Patient'];
  public types: DoctorTypeModel[] = [];
  public typesEnabled: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly loaderService: LoaderService,
    private readonly snackBar: MatSnackBar,
    public location: Location,
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.authService.getAllTypes()
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
        map(model => this.types = model)
      )
      .subscribe()
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      lastName: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      password: this.formBuilder.control('', [Validators.required, Validators.minLength(8)]),
      role: this.formBuilder.control('', [Validators.required]),
      types: this.formBuilder.control(''),
      image: this.formBuilder.control('', [Validators.required])
    });

    (this.form.controls['types'] as FormControl).disable();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public signUp(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderService.showLoader();

    const signUpModel : SignUpModel = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      role: this.form.controls['role'].value,
      image: this.selectedFile,
      doctorTypeId: this.form.controls['types'].value ? this.form.controls['types'].value : ""
    }

    this.authService.register(signUpModel)
      .pipe(
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => {
          this.authService.authData$.pipe(
            map((data) => {
              if (!!data && !!data.token && data?.role?.toLowerCase() === 'doctor'){
                this.router.navigate(['/doctor/schedule']);
              }
              else if (!!data && !!data.token && data?.role?.toLowerCase() === 'patient'){
                this.router.navigate(['/patient/menu', data?.userId]);
              }
            })
          ).subscribe();
        },
        error => this.snackBar.open(error.error, 'OK')
      );
  }

  get firstNameControl(): FormControl {
    return this.form.get('firstName') as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.form.get('lastName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get rolesControl(): FormControl {
    return this.form.get('role') as FormControl;
  }

  get typesControl(): FormControl {
    return this.form.get('types') as FormControl;
  }

  get imageControl(): FormControl {
    return this.form.get('image') as FormControl;
  }

  public chooseRole(role: string){
    if(role === 'Doctor'){
      (this.form.controls['types'] as FormControl).enable();
      this.typesEnabled = true;
    }
    else{
      (this.form.controls['types'] as FormControl).disable();
      this.typesEnabled = false;
      this.form.controls['types'].reset();
    }
  }

  public onFileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileCreated = true;

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.selectedFileUrl = reader.result;
    }
  }

  public touchImage(): void {
    this.imageTouched = true;
  }

}
