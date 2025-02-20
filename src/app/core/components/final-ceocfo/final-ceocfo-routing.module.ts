import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CeoCfoapprovalRequisitionlistComponent } from './ceo-cfoapproval-requisitionlist/ceo-cfoapproval-requisitionlist.component';

const routes: Routes = [
  { 
    path: 'ceocfoapproval',
    component: CeoCfoapprovalRequisitionlistComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalCeocfoRoutingModule { }
