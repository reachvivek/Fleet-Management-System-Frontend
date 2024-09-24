import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthenticationModule } from './authentication/authentication.module';
import { PagesModule } from './pages/pages.module';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BASE_PATH } from '../swagger';
import { environment as dev } from '../environments/dev/environment';
import { environment as prod } from '../environments/prod/environment';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    AuthenticationModule,
    PagesModule,
    InputOtpModule,
    ToastModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    MessageService,
    ConfirmationService,
    { provide: BASE_PATH, useValue: prod.BASE_PATH },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
