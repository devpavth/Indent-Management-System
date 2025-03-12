import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalCeocfoRoutingModule } from './final-ceocfo-routing.module';
import { CeoCfoapprovalRequisitionlistComponent } from './ceo-cfoapproval-requisitionlist/ceo-cfoapproval-requisitionlist.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewceoCfoapprovalRequisitionComponent } from './viewceo-cfoapproval-requisition/viewceo-cfoapproval-requisition.component';
import { UpdateSignatureComponent } from './update-signature/update-signature.component';
import { SharedModule } from "../../../shared/shared.module";
import { ProcurementModule } from "../procurement/procurement.module";

@NgModule({
  declarations: [
    CeoCfoapprovalRequisitionlistComponent,
    ViewceoCfoapprovalRequisitionComponent,
    UpdateSignatureComponent
  ],
  imports: [CommonModule, FinalCeocfoRoutingModule, FormsModule, ReactiveFormsModule, SharedModule, ProcurementModule],
})
export class FinalCeocfoModule {}
