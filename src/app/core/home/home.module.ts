import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { LeftMenuComponent } from '../Layouts/left-menu/left-menu.component';
import { HeaderComponent } from '../Layouts/header/header.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
@NgModule({
  declarations: [
    StartingPageComponent,
    LeftMenuComponent,
    HeaderComponent,
    DashboardComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
