import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock/stock.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { TProductComponent } from './t-product/t-product.component';
import { InwardAlertComponent } from './inward-alert/inward-alert.component';

import { TransactionRoutingModule } from './transaction-routing.module';
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
  declarations: [
    StockComponent,
    ViewTransactionComponent,
    TProductComponent,
    InwardAlertComponent,
  ],
  imports: [CommonModule, TransactionRoutingModule, SharedModule],
})
export class TransactionModule {}
