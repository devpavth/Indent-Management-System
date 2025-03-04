import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'finalCeocfo', loadChildren: () => import('./core/components/final-ceocfo/final-ceocfo.module').then(m => m.FinalCeocfoModule) }, { path: 'reports', loadChildren: () => import('./core/components/reports/reports.module').then(m => m.ReportsModule) }, { path: 'transaction', loadChildren: () => import('./core/components/transaction/transaction/transaction.module').then(m => m.TransactionModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
