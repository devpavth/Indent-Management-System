import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { RequisitionListComponent } from './requisition-list/requisition-list.component';
import { ViewRequistionComponent } from './view-requistion/view-requistion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SharedModule } from "../../../shared/shared.module";
import { ViewFundDetailsComponent } from './view-fund-details/view-fund-details.component';

@NgModule({
  declarations: [RequisitionListComponent, ViewRequistionComponent, EditProductComponent, ViewFundDetailsComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
],
})
export class FinanceModule {}
