import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockreportBranchComponent } from './stockreport-branch/stockreport-branch.component';

const routes: Routes = [
  { path: 'stockReports', 
    component: StockreportBranchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
