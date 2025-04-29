import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { RequisitionListComponent } from './requisition-list/requisition-list.component';
import { ViewRequistionComponent } from './view-requistion/view-requistion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SharedModule } from '../../../shared/shared.module';
import { ViewFundDetailsComponent } from './view-fund-details/view-fund-details.component';
import { ViewFundbranchreasonComponent } from './view-fundbranchreason/view-fundbranchreason.component';
import { AddFunderComponent } from './Funder/add-funder/add-funder.component';
import { FunderListComponent } from './Funder/funder-list/funder-list.component';
import { ViewFunderComponent } from './Funder/view-funder/view-funder.component';
import { FundaddComponent } from './Funder/fundadd/fundadd.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    RequisitionListComponent,
    ViewRequistionComponent,
    EditProductComponent,
    ViewFundDetailsComponent,
    ViewFundbranchreasonComponent,
    AddFunderComponent,
    FunderListComponent,
    ViewFunderComponent,
    FundaddComponent,
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
})
export class FinanceModule {}
