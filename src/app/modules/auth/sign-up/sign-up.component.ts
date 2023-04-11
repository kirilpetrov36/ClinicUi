import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { SignUpModel } from 'src/app/shared/models/sign-up.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

  public form!: FormGroup;

  private readonly unsubscribe$ = new Subject<void>();
  public roles: string[] = ['Doctor', 'Patient']

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly loaderService: LoaderService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control('', [Validators.required]),
      lastName: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required]),
      role: this.formBuilder.control('', [Validators.required])
    });
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
      role: this.form.controls['role'].value
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
        () => this.snackBar.open('Wrong email or password!', 'OK')
      );
  }

  get rolesControl(): FormControl {
    return this.form.get('role') as FormControl;
  }

}
