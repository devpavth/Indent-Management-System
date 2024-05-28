import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { RequisitionListComponent } from './requisition-list/requisition-list.component';
import { ViewRequistionComponent } from './view-requistion/view-requistion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RequisitionListComponent, ViewRequistionComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FinanceModule {}
