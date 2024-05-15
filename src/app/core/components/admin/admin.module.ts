import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddEmployeeComponent } from './Employee/add-employee/add-employee.component';
import { EmployeeListComponent } from './Employee/employee-list/employee-list.component';

import { AddProductComponent } from './Products/add-product/add-product.component';
import { ProductListComponent } from './Products/product-list/product-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { SearchItemPipe } from './pipes/search-item.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProductComponent } from './Products/view-product/view-product.component';
import { SuccessComponent } from './Products/success/success.component';
import { DeleteComponent } from './Products/delete/delete.component';
import { ViewEmployeeComponent } from './Employee/view-employee/view-employee.component';
import { SuccessPopComponent } from './Employee/success-pop/success-pop.component';
import { DeletePopComponent } from './Employee/delete-pop/delete-pop.component';
import { AddBranchComponent } from './Branch/add-branch/add-branch.component';
import { ViewBranchComponent } from './Branch/view-branch/view-branch.component';
import { BranchListComponent } from './Branch/branch-list/branch-list.component';
import { SuccessForBranchComponent } from './Branch/success-for-branch/success-for-branch.component';

@NgModule({
  providers: [DatePipe],
  declarations: [
    AddEmployeeComponent,
    EmployeeListComponent,
    AddProductComponent,
    ProductListComponent,
    SearchItemPipe,
    ViewProductComponent,
    SuccessComponent,
    DeleteComponent,
    ViewEmployeeComponent,
    SuccessPopComponent,
    DeletePopComponent,
    AddBranchComponent,
    ViewBranchComponent,
    BranchListComponent,
    SuccessForBranchComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
