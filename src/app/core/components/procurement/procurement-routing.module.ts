import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComparisonComponent } from './comparison/comparison.component';
import { ProcurementRequestlistComponent } from './procurement-requestlist/procurement-requestlist.component';

const routes: Routes = [
  { component: ComparisonComponent, path: 'qComparison' },
  {component: ProcurementRequestlistComponent, path: 'proReqList'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcurementRoutingModule {}
