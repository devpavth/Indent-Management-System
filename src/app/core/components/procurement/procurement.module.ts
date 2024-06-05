import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurementRoutingModule } from './procurement-routing.module';
import { ComparisonComponent } from './comparison/comparison.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [ComparisonComponent],
  imports: [CommonModule, ProcurementRoutingModule, SharedModule],
})
export class ProcurementModule {}
