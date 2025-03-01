import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CeoCfoapprovalRequisitionlistComponent } from './ceo-cfoapproval-requisitionlist/ceo-cfoapproval-requisitionlist.component';
import { UpdateSignatureComponent } from './update-signature/update-signature.component';

const routes: Routes = [
  { 
    path: 'ceocfoapproval',
    component: CeoCfoapprovalRequisitionlistComponent
   },
   {
      path: 'updateSign',
      component: UpdateSignatureComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalCeocfoRoutingModule { }
