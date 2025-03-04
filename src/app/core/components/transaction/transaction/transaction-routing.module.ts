import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { TProductComponent } from './t-product/t-product.component';
import { InwardAlertComponent } from './inward-alert/inward-alert.component';

const routes: Routes = [
  { path: 'inoutstock',  
    component: StockComponent
  },
  {
    path: 'pTransaction',
    component: TProductComponent
  },
  {
    path: 'inwardAlert',
    component: InwardAlertComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
