import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequisitionListComponent } from './requisition-list/requisition-list.component';
import { ViewRequistionComponent } from './view-requistion/view-requistion.component';
import { AddFunderComponent } from './Funder/add-funder/add-funder.component';
import { FunderListComponent } from './Funder/funder-list/funder-list.component';
import { ViewFunderComponent } from './Funder/view-funder/view-funder.component';

const routes: Routes = [
  { component: RequisitionListComponent, path: 'finRequestList' },
  { component: ViewRequistionComponent, path: 'finViewRequest' },
  { component: AddFunderComponent, path: 'addFunder' },
  { component: FunderListComponent, path: 'funderList' },
  { component: ViewFunderComponent, path: 'viewFunder' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
