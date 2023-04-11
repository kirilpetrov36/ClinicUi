import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent implements OnInit, OnDestroy {

  public form!: FormGroup;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly loaderService: LoaderService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public signIn(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.loaderService.showLoader();

    const email = this.form.controls['email'].value;
    const password = this.form.controls['password'].value;

    this.authService.login(email, password)
      .pipe(
        finalize(() => this.loaderService.hideLoader()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => {
          this.authService.authData$.pipe(
            map((data) => {
              if (!!data && !!data.token && data?.role?.toLowerCase() === 'doctor'){
                this.router.navigate(['/doctor/schedule'])
              }
              else if (!!data && !!data.token && data?.role?.toLowerCase() === 'patient'){
                this.router.navigate(['/patient/menu', data?.userId]);
              }
            })
          ).subscribe();    
        },
        () => this.snackBar.open('Wrong email or password!', 'OK', {
          duration: 20000,
        })
      );
  }

}
