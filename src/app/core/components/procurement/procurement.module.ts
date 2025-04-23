import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurementRoutingModule } from './procurement-routing.module';
import { ComparisonComponent } from './comparison/comparison.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcurementRequestlistComponent } from './procurement-requestlist/procurement-requestlist.component';
import { ViewProcurementreqComponent } from './view-procurementreq/view-procurementreq.component';
import { ViewAcceptedprocurementreqComponent } from './view-acceptedprocurementreq/view-acceptedprocurementreq.component';
import { ViewConsolidatedquoteComponent } from './view-consolidatedquote/view-consolidatedquote.component';
import { ViewPurchaseorderComponent } from './view-purchaseorder/view-purchaseorder.component';
import { PurchaseorderlistComponent } from './purchaseorderlist/purchaseorderlist.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    ComparisonComponent,
    ProcurementRequestlistComponent,
    ViewProcurementreqComponent,
    ViewAcceptedprocurementreqComponent,
    ViewConsolidatedquoteComponent,
    ViewPurchaseorderComponent,
    PurchaseorderlistComponent,
  ],
  imports: [
    CommonModule,
    ProcurementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
  ],
  exports: [ViewConsolidatedquoteComponent],
})
export class ProcurementModule {}
