import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockreportBranchComponent } from './stockreport-branch/stockreport-branch.component';
import { IndentreportsComponent } from './indentreports/indentreports.component';

const routes: Routes = [
  { path: 'stockReports', 
    component: StockreportBranchComponent
  },
  {
    path: 'indentReports',
    component: IndentreportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
