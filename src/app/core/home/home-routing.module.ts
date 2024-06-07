import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { routingGuardsGuard } from '../Guards/routing-guards.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: StartingPageComponent,
    children: [
      {
        path: '',

        loadChildren: () =>
          import('../components/request/request.module').then(
            (m) => m.RequestModule,
          ),
      },
      {
        path: '',

        loadChildren: () =>
          import('../components/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '',
        loadChildren: () =>
          import('../components/finance/finance.module').then(
            (m) => m.FinanceModule,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('../components/procurement/procurement.module').then(
            (m) => m.ProcurementModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
