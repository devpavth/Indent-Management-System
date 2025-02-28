import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalCeocfoRoutingModule } from './final-ceocfo-routing.module';
import { CeoCfoapprovalRequisitionlistComponent } from './ceo-cfoapproval-requisitionlist/ceo-cfoapproval-requisitionlist.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewceoCfoapprovalRequisitionComponent } from './viewceo-cfoapproval-requisition/viewceo-cfoapproval-requisition.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [
    CeoCfoapprovalRequisitionlistComponent,
    ViewceoCfoapprovalRequisitionComponent
  ],
  imports: [CommonModule, FinalCeocfoRoutingModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class FinalCeocfoModule {}
