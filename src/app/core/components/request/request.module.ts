import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RequestFormComponent } from './request-form/request-form.component';
import { BranchApprovelComponent } from './branch-approvel/branch-approvel.component';
import { AdminApprovelComponent } from './admin-approvel/admin-approvel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { YourRequestComponent } from './your-request/your-request.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { OtherProductComponent } from './other-product/other-product.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  declarations: [
    RequestFormComponent,
    BranchApprovelComponent,
    AdminApprovelComponent,
    YourRequestComponent,
    ViewRequestComponent,
    OtherProductComponent,
    VerificationComponent,
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
})
export class RequestModule {}
