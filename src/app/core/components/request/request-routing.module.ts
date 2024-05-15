import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestFormComponent } from './request-form/request-form.component';
import { BranchApprovelComponent } from './branch-approvel/branch-approvel.component';
import { AdminApprovelComponent } from './admin-approvel/admin-approvel.component';
import { YourRequestComponent } from './your-request/your-request.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { OtherProductComponent } from './other-product/other-product.component';

const routes: Routes = [
  { component: RequestFormComponent, path: 'request' },
  { component: BranchApprovelComponent, path: 'branchApprovel' },
  { component: AdminApprovelComponent, path: 'adminApprovel' },
  { component: YourRequestComponent, path: 'yourRequest' },
  { component: ViewRequestComponent, path: 'viewRequest' },
  { component: OtherProductComponent, path: 'others' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
