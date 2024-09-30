import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  responseErrorInterceptor,
  withCredentialsInterceptor,
} from './core/interceptors/http.interceptor';
import { LoginComponent } from './features/login/login.component';
import { UsersComponent } from './features/users/users.component';
import { AppRoutingModule } from './routing.module';

@NgModule({
  declarations: [AppComponent, LoginComponent, UsersComponent],
  bootstrap: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, FormsModule],
  providers: [
    provideHttpClient(
      withInterceptors([withCredentialsInterceptor, responseErrorInterceptor]),
    ),
  ],
})
export class AppModule {}
