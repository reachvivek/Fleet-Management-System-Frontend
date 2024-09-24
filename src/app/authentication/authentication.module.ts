import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../standalone/loader/loader.component';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    LoginComponent,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    InputOtpModule,
    ToastModule,
    LoaderComponent,
  ],
})
export class AuthenticationModule {}
