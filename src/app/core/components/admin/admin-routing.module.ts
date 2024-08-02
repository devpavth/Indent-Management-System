import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './Employee/add-employee/add-employee.component';
import { SharedModule } from '../../../shared/shared.module';
import { EmployeeListComponent } from './Employee/employee-list/employee-list.component';
import { ProductListComponent } from './Products/product-list/product-list.component';
import { AddProductComponent } from './Products/add-product/add-product.component';
import { ViewProductComponent } from './Products/view-product/view-product.component';
import { ViewEmployeeComponent } from './Employee/view-employee/view-employee.component';
import { AddBranchComponent } from './Branch/add-branch/add-branch.component';
import { BranchListComponent } from './Branch/branch-list/branch-list.component';
import { ViewBranchComponent } from './Branch/view-branch/view-branch.component';

import { AddVendorComponent } from './vendor/add-vendor/add-vendor.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { AddFunderComponent } from './Funder/add-funder/add-funder.component';
import { FunderListComponent } from './Funder/funder-list/funder-list.component';
import { ViewFunderComponent } from './Funder/view-funder/view-funder.component';
import { StockComponent } from './Products/stock/stock.component';
import { TProductComponent } from './Transaction/t-product/t-product.component';
import { RStockComponent } from './report/r-stock/r-stock.component';
import { HeadOfAccComponent } from './Products/head-of-acc/head-of-acc.component';
import { ViewListComponent } from './Branch/view-list/view-list.component';
import { AddListComponent } from './Branch/add-list/add-list.component';

const routes: Routes = [
  { component: AddEmployeeComponent, path: 'addEmployee' },
  { component: EmployeeListComponent, path: 'employeeList' },
  { component: ProductListComponent, path: 'productList' },
  { component: AddProductComponent, path: 'addProduct' },
  { component: ViewProductComponent, path: 'viewProduct' },
  { component: ViewEmployeeComponent, path: 'viewEmployee' },
  { component: AddBranchComponent, path: 'addBranch' },
  { component: BranchListComponent, path: 'branchList' },
  { component: ViewBranchComponent, path: 'viewBranch' },
  { component: AddVendorComponent, path: 'addVendor' },
  { component: VendorListComponent, path: 'vendorList' },
  { component: AddFunderComponent, path: 'addFunder' },
  { component: FunderListComponent, path: 'funderList' },
  { component: ViewFunderComponent, path: 'viewFunder' },
  { component: StockComponent, path: 'inoutstock' },
  { component: TProductComponent, path: 'pTransaction' },
  { component: RStockComponent, path: 'stockReport' },
  { component: HeadOfAccComponent, path: 'headOfAcc' },
  { component: ViewListComponent, path: 'viewList/:id' },
  { component: AddListComponent, path: 'addList/:id' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SharedModule],
})
export class AdminRoutingModule {}
