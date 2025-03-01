import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { StockreportBranchComponent } from './stockreport-branch/stockreport-branch.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IndentreportsComponent } from './indentreports/indentreports.component';
import { SharedModule } from "../../../shared/shared.module";


@NgModule({
  declarations: [StockreportBranchComponent, IndentreportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
],
})
export class ReportsModule {}
