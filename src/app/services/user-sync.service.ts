import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/prod/environment';
import {
  AdminService,
  AuthService,
  BatteryRequestService,
  BulkUploadService,
  ComplianceRequestService,
  MaintenanceRequestService,
  TransactionService,
  TyreRequestService,
} from '../../swagger';

@Injectable({
  providedIn: 'root',
})
export class UserSyncService {
  private token: string = '';
  private isAdminSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private bulkUploadService: BulkUploadService,
    private maintenanceRequestService: MaintenanceRequestService,
    private complianceRequestService: ComplianceRequestService,
    private transactionService: TransactionService,
    private batteryService: BatteryRequestService,
    private tyreService: TyreRequestService
  ) {}

  // private async refreshToken() {
  //   try {
  //     const res: any = await firstValueFrom(
  //       this.authService.authRefreshTokenGet()
  //     );
  //     if (res && res.token) {
  //       console.log('Refresh Token: ', res.token);
  //       this.token = res.token;
  //       localStorage.setItem('token', res.token!);
  //       this.initApis(this.token);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  ngOnInit(): void {
    this.loadState();
  }

  loadState() {
    this.token = localStorage.getItem('token')!;
    this.initApis(this.token);
  }

  async checkUserPrivileges(): Promise<boolean> {
    try {
      const isAdminUser: boolean = await firstValueFrom(
        this.adminService.adminIsAdminGet()
      );
      this.isAdminSubject.next(isAdminUser);
      return isAdminUser;
    } catch (err) {
      console.log(err);
      this.isAdminSubject.next(false);
      return false; // Explicitly return false if there is an error
    }
  }

  get isAdmin$() {
    return this.isAdminSubject.asObservable();
  }

  async sendForgotPasswordOTP(credentials: { employeecode: string }) {
    try {
      const res: any = await firstValueFrom(
        this.authService.authSendForgotPasswordOTPPost(credentials)
      );
      if (res && res.verified && res.otp_sent) {
        sessionStorage.setItem('credentials', JSON.stringify(credentials));
        sessionStorage.setItem('action', 'forgotpassword');
        // To Do Refresh Token
        return true;
      } else {
        throw new Error('Invalid employee code!');
      }
    } catch (error) {
      console.error('Error during sending OTP:', error);
      throw error;
    }
  }

  encryptPassword(password: string): string {
    const key = CryptoJS.enc.Utf8.parse(environment.KEY);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const cipherText = iv
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);
    return cipherText;
  }

  async sendLoginOTP(
    credentials: { employeecode: string; password: string },
    resendOTP: boolean = false
  ) {
    const creds = { ...credentials };
    if (!resendOTP) {
      creds.password = this.encryptPassword(credentials.password);
    }
    try {
      const res: any = await firstValueFrom(
        this.authService.authSendLoginOTPPost(creds)
      );
      if (res && res.verified && res.otp_sent) {
        sessionStorage.setItem('credentials', JSON.stringify(creds));
        sessionStorage.setItem('action', 'login');
        // To Do Refresh Token
        return true;
      } else {
        throw new Error('Wrong email or password!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async verifySetNewPasswordOTP(otp: string) {
    try {
      let credentials = JSON.parse(sessionStorage.getItem('credentials')!);
      credentials.otp = otp;
      const res: any = await firstValueFrom(
        this.authService.authVerifyForgotPasswordOTPPost(credentials)
      );
      if (res && res.token && res.token.length) {
        this.token = res.token;
        sessionStorage.clear();
        sessionStorage.removeItem('credentials');
        sessionStorage.setItem('forgotPasswordToken', this.token);
        // To Do Refresh Token
        this.initApis(this.token);
        return res;
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async setNewPassword(credentials: { password: string }) {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${sessionStorage.getItem(
          'forgotPasswordToken'
        )}`,
      });
      this.authService.defaultHeaders = headers;
      credentials.password = this.encryptPassword(credentials.password);
      const res: any = await firstValueFrom(
        this.authService.authSetNewPasswordPost(credentials)
      );
      if (res && res.updated) {
        return res;
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (err: any) {
      console.log(err);
      return err;
    }
  }

  async login(otp: string) {
    try {
      let credentials = JSON.parse(sessionStorage.getItem('credentials')!);
      credentials.otp = otp;
      const res: any = await firstValueFrom(
        this.authService.authLoginPost(credentials)
      );
      if (res && res.token && res.token.length) {
        this.token = res.token;
        localStorage.setItem('token', this.token);
        sessionStorage.clear();
        sessionStorage.removeItem('credentials');
        // To Do Refresh Token
        this.initApis(this.token);
        return res;
      } else {
        throw new Error('Token not received in the response');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  private initApis(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.authService.defaultHeaders = headers;
    this.maintenanceRequestService.defaultHeaders = headers;
    this.adminService.defaultHeaders = headers;
    this.bulkUploadService.defaultHeaders = headers;
    this.transactionService.defaultHeaders = headers;
    this.complianceRequestService.defaultHeaders = headers;
    this.batteryService.defaultHeaders = headers;
    this.tyreService.defaultHeaders = headers;
  }

  public async logout() {
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    // localStorage.clear();
    this.router.navigate(['/auth']);
  }
}
