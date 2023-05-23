import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import {RouterModule, Routes} from "@angular/router";
import { ApproveComponent } from './approve/approve.component';
import {TypesComponent, TypesUpdateComponent} from './types/types.component';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../../shared/modules/material.module";
import {SharedModule} from "../../../shared/components/shared.module";

const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'approve',
    component: ApproveComponent
  },
  {
    path: 'types',
    component: TypesComponent
  }
];

@NgModule({
  declarations: [MenuComponent, ApproveComponent, TypesComponent, TypesUpdateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class MenuModule { }
