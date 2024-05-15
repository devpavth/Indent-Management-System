import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './Settings/profile/profile.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NetworkErrorComponent } from './network-error/network-error.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'unauth', component: UnauthorizedComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'networkerror', component: NetworkErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
