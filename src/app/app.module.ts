import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { LoginComponent } from './features/login/login.component';
import { UsersComponent } from './features/users/users.component';
import { AppRoutingModule } from './routing.module';

@NgModule({
  declarations: [AppComponent, LoginComponent, UsersComponent],
  bootstrap: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
