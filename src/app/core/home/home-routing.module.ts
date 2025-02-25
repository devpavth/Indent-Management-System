import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../Guards/auth/auth.guard';
// import { routingGuardsGuard } from '../Guards/routing-guards.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: StartingPageComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: {
          roles: [
            'ROLE_IT_ADMIN',
            'ROLE_USER',
            'ROLE_PROGRAM_AUTH',
            'ROLE_BRANCH_AUTH',
            'ROLE_ADMIN_AUTH',
            'ROLE_FINANCE_AUTH',
            'ROLE_PROCUREMENT_AUTH',
            'ROLE_DIRECTOR_FINANCE',
            'ROLE_PROCUREMENT_MANAGER',
            'ROLE_CEO',
            'ROLE_HEAD_ADMIN',
          ],
        },
      },
      {
        path: '',

        loadChildren: () =>
          import('../components/request/request.module').then(
            (m) => m.RequestModule,
          ),
        canActivate: [authGuard],
        data: {
          roles: [
            'ROLE_USER',
            'ROLE_PROGRAM_AUTH',
            'ROLE_BRANCH_AUTH',
            'ROLE_ADMIN_AUTH',
          ],
        },
      },
      {
        path: '',

        loadChildren: () =>
          import('../components/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [authGuard],
        data: { roles: ['ROLE_IT_ADMIN'] },
      },

      {
        path: '',
        loadChildren: () =>
          import('../components/finance/finance.module').then(
            (m) => m.FinanceModule,
          ),
        canActivate: [authGuard],
        data: { roles: ['ROLE_FINANCE_AUTH'] },
      },
      {
        path: '',
        loadChildren: () =>
          import('../components/procurement/procurement.module').then(
            (m) => m.ProcurementModule,
          ),
        canActivate: [authGuard],
        data: { roles: ['ROLE_PROCUREMENT_AUTH'] },
      },
      {
        path: '',
        loadChildren: () =>
          import('../components/final-ceocfo/final-ceocfo.module').then(
            (m) => m.FinalCeocfoModule,
          ),
        canActivate: [authGuard],
        data: { roles: ['ROLE_PROCUREMENT_AUTH'] },
      },
      {
        path: '',
        loadChildren: () =>
          import('../components/reports/reports.module').then(
            (m) => m.ReportsModule,
          ),
        canActivate: [authGuard],
        data: { roles: ['ROLE_IT_ADMIN'] },
      },
    ],
  },
  {
    path: '**',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
