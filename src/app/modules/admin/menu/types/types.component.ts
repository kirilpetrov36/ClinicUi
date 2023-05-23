import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {DoctorTypeModel} from "../../../../shared/models/doctor-type.model";
import {Subject} from "rxjs";
import {AuthService} from "../../../../shared/services/auth.service";
import {LoaderService} from "../../../../shared/services/loader.service";
import {finalize, map, takeUntil} from "rxjs/operators";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Location} from '@angular/common';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypesComponent implements OnInit {

  public typeModels!: MatTableDataSource<DoctorTypeModel>;
  public displayedColumns: string[] = ['id', 'name', 'updatedAt', 'actions'];
  private readonly unsubscribe$ = new Subject<void>();
  public form!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly loaderService: LoaderService,
    private readonly formBuilder: FormBuilder,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();

    this.form = this.formBuilder.group({
      types: this.formBuilder.array([])
    });

    this.typeModels = new MatTableDataSource();

    this.authService.getAllTypes()
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader()),
        map(model => {
          //this.typeModels = model;
          this.typeModels = new MatTableDataSource(model);
          this.changeDetectorRefs.detectChanges();
          //this.fillForm(model);
        })
      )
      .subscribe();
  }

  // private fillForm(types: DoctorTypeModel[]): void {
  //   types.forEach(value => {
  //     (this.form.controls['types'] as FormArray).push(
  //       this.formBuilder.group({
  //         id: this.formBuilder.control(value.id),
  //         name: this.formBuilder.control(value.name)
  //       })
  //     )
  //   })
  // }

  public submit(): void {
    this.loaderService.showLoader();

    this.authService.updateTypes(this.typeModels.data)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe();
  }

  // get types(): FormArray{
  //   return this.form.controls['types'] as FormArray;
  // }

  public remove(index: number): void {
    (this.form.controls['types'] as FormArray).removeAt(index);
    this.typeModels.data.splice(index, 1);
    this.typeModels = new MatTableDataSource(this.typeModels.data);
    this.changeDetectorRefs.detectChanges();
  }

  public addType(): void {
    const newType: DoctorTypeModel = {
      id: undefined,
      name: "empty_name",
      updatedAt: new Date
    }
    this.typeModels.data.push(newType);
    this.typeModels = new MatTableDataSource(this.typeModels.data);
    this.changeDetectorRefs.detectChanges();
  }

  openDialog(type: DoctorTypeModel, index: number): void {
    const dialogRef = this.dialog.open(TypesUpdateComponent, {
      data: type,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.typeModels.data[index].name = result;
      this.typeModels = new MatTableDataSource(this.typeModels.data);
      this.changeDetectorRefs.detectChanges();
      console.log(this.typeModels);
    });
  }

}

@Component({
  selector: 'types-update',
  templateUrl: './types-update.html',
  styleUrls: ['./types-update.scss']
})
export class TypesUpdateComponent {
  constructor(
    public dialogRef: MatDialogRef<TypesUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorTypeModel,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
