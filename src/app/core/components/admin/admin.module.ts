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

import { ViewEmployeeComponent } from './Employee/view-employee/view-employee.component';
import { SuccessPopComponent } from './Employee/success-pop/success-pop.component';
import { DeletePopComponent } from './Employee/delete-pop/delete-pop.component';
import { AddBranchComponent } from './Branch/add-branch/add-branch.component';
import { ViewBranchComponent } from './Branch/view-branch/view-branch.component';
import { BranchListComponent } from './Branch/branch-list/branch-list.component';
import { SuccessForBranchComponent } from './Branch/success-for-branch/success-for-branch.component';
import { AddDonarComponent } from './Donar/add-donar/add-donar.component';
import { DonarListComponent } from './Donar/donar-list/donar-list.component';
import { ViewDonarComponent } from './Donar/view-donar/view-donar.component';
import { AddVendorComponent } from './vendor/add-vendor/add-vendor.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { ViewVendorComponent } from './vendor/view-vendor/view-vendor.component';
import { AddingComponent } from './Products/adding/adding.component';

@NgModule({
  providers: [DatePipe],
  declarations: [
    AddEmployeeComponent,
    EmployeeListComponent,
    AddProductComponent,
    ProductListComponent,
    SearchItemPipe,
    ViewProductComponent,

    ViewEmployeeComponent,
    SuccessPopComponent,
    DeletePopComponent,
    AddBranchComponent,
    ViewBranchComponent,
    BranchListComponent,
    SuccessForBranchComponent,
    AddDonarComponent,
    DonarListComponent,
    ViewDonarComponent,
    AddVendorComponent,
    VendorListComponent,
    ViewVendorComponent,
    AddingComponent,
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
