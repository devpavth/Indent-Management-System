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

@NgModule({
  declarations: [
    ComparisonComponent,
    ProcurementRequestlistComponent,
    ViewProcurementreqComponent,
    ViewAcceptedprocurementreqComponent,
    ViewConsolidatedquoteComponent,
    ViewPurchaseorderComponent,
  ],
  imports: [
    CommonModule,
    ProcurementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProcurementModule {}
