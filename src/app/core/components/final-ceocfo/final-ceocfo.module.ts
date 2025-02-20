import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalCeocfoRoutingModule } from './final-ceocfo-routing.module';
import { CeoCfoapprovalRequisitionlistComponent } from './ceo-cfoapproval-requisitionlist/ceo-cfoapproval-requisitionlist.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CeoCfoapprovalRequisitionlistComponent
  ],
  imports: [CommonModule, FinalCeocfoRoutingModule, FormsModule, ReactiveFormsModule],
})
export class FinalCeocfoModule {}
