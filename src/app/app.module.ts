import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RequestModule } from './core/components/request/request.module';
import { AdminModule } from './core/components/admin/admin.module';
import { HomeModule } from './core/home/home.module';
import { LoginComponent } from './core/home/login/login.component';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { tokenInterceptor } from './core/components/service/token.interceptor';

// const config: SocketIoConfig = { url: 'http://192.168.1.7:9001/', options: {} };

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RequestModule,
    AdminModule,
    HomeModule,
    HttpClientModule,
    SharedModule,

    // SocketIoModule.forRoot(config)
  ],
  providers: [provideHttpClient(withInterceptors([tokenInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {}
