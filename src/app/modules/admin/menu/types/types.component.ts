import { Component, OnInit } from '@angular/core';
import {DoctorTypeModel} from "../../../../shared/models/doctor-type.model";
import {Subject} from "rxjs";
import {AuthService} from "../../../../shared/services/auth.service";
import {LoaderService} from "../../../../shared/services/loader.service";
import {finalize, map, takeUntil} from "rxjs/operators";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  public typeModels: DoctorTypeModel[] = [];
  private readonly unsubscribe$ = new Subject<void>();
  public form!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly loaderService: LoaderService,
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();

    this.form = this.formBuilder.group({
      types: this.formBuilder.array([])
    });

    this.authService.getAllTypes()
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
        map(model => {
          this.typeModels = model;
          this.fillForm(model);
        })
      )
      .subscribe();
  }

  private fillForm(types: DoctorTypeModel[]): void {
    types.forEach(value => {
      (this.form.controls['types'] as FormArray).push(
        this.formBuilder.group({
          id: this.formBuilder.control(value.id),
          name: this.formBuilder.control(value.name)
        })
      )
    })
  }

  public submit(): void {

    this.loaderService.showLoader();


    this.authService.updateTypes(this.allTypes())
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe();
  }

  get types(): FormArray{
    return this.form.controls['types'] as FormArray;
  }

  public remove(index: number): void {
    (this.form.controls['types'] as FormArray).removeAt(index);
  }

  public allTypes(): DoctorTypeModel[] {

    const types: DoctorTypeModel[] = [];

    (this.form.controls['types'] as FormArray).controls.forEach(formGroup => {
      types.push(formGroup.value);
    });

    console.log(types);

    return types;
  }

  public addType(): void {
    (this.form.controls['types'] as FormArray).push(
      this.formBuilder.group({
        id: this.formBuilder.control(null),
        name: this.formBuilder.control('')
      })
    )
  }
}
