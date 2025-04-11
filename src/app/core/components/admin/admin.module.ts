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

import { AddVendorComponent } from './vendor/add-vendor/add-vendor.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { ViewVendorComponent } from './vendor/view-vendor/view-vendor.component';
import { AddingComponent } from './Products/adding/adding.component';
import { ProductStockComponent } from './Products/product-stock/product-stock.component';
import { RStockComponent } from './report/r-stock/r-stock.component';
import { HeadOfAccComponent } from './Products/head-of-acc/head-of-acc.component';

import { ViewListComponent } from './Branch/view-list/view-list.component';
import { AddListComponent } from './Branch/add-list/add-list.component';
import { EditListComponent } from './Branch/edit-list/edit-list.component';
import { RoleMappingComponent } from './Employee/role-mapping/role-mapping.component';
import { ViewDesignationRoleComponent } from './Employee/view-designation-role/view-designation-role.component';
import { AddNewdesignationComponent } from './Employee/add-newdesignation/add-newdesignation.component';
import { AddNewlevelComponent } from './Employee/add-newlevel/add-newlevel.component';
import { UpdatelevelFordesignationComponent } from './Employee/updatelevel-fordesignation/updatelevel-fordesignation.component';
import { CompanyDetailsComponent } from './Company/company-details/company-details.component';
import { ViewCompanydetailsComponent } from './Company/view-companydetails/view-companydetails.component';
import { UploadCompanylogoComponent } from './Company/upload-companylogo/upload-companylogo.component';
import { PrefixComponent } from './prefix/prefix/prefix.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PreviewCompanylogoComponent } from './Company/preview-companylogo/preview-companylogo.component';

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

    AddVendorComponent,
    VendorListComponent,
    ViewVendorComponent,
    AddingComponent,
    ProductStockComponent,
    RStockComponent,
    HeadOfAccComponent,

    ViewListComponent,
    AddListComponent,
    EditListComponent,
    RoleMappingComponent,
    ViewDesignationRoleComponent,
    AddNewdesignationComponent,
    AddNewlevelComponent,
    UpdatelevelFordesignationComponent,
    CompanyDetailsComponent,
    ViewCompanydetailsComponent,
    UploadCompanylogoComponent,
    PrefixComponent,
    PreviewCompanylogoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
  ],
  exports: [PrefixComponent],
})
export class AdminModule {}
