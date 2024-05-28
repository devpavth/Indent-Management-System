import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequisitionListComponent } from './requisition-list/requisition-list.component';
import { ViewRequistionComponent } from './view-requistion/view-requistion.component';

const routes: Routes = [
  { component: RequisitionListComponent, path: 'finRequestList' },
  { component: ViewRequistionComponent, path: 'finViewRequest' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
