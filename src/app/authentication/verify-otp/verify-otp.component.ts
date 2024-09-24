import { Component } from '@angular/core';
import { UserSyncService } from '../../services/user-sync.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  public showLoader = false;
  showIncorrectOTP = false;
  showAccountBlocked = false;
  showOTPExpired = false;
  showOTPSent = true;

  countdownMinutes: number = 1;
  countdownSeconds: number = 0;
  interval: any;

  isDisabled = true;
  public otpForm = {
    otp: '',
  };
  public otpLength: number = 6;

  isInputFocusedOrTyped: boolean = false;

  constructor(
    private userSyncService: UserSyncService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.disableOTPBtnTemp(this.countdownMinutes * 60 * 1000);
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
      }
      const creds = sessionStorage.getItem('credentials');
      if (!creds || !creds.length) {
        this.router.navigate(['/login']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countdownSeconds > 0) {
        this.countdownSeconds--;
      } else {
        if (this.countdownMinutes > 0) {
          this.countdownMinutes--;
          this.countdownSeconds = 59;
        } else {
          clearInterval(this.interval);
        }
      }
    }, 1000);
  }

  disableOTPBtnTemp(time: number) {
    this.isDisabled = true;
    this.startCountdown();
    setTimeout(() => {
      this.isDisabled = false;
    }, time);
  }

  onSubmit = async () => {
    this.showLoader = true;
    if (!this.otpForm.otp) {
      this.showLoader = false;
      return;
    } else {
      this.verifyOtp();
    }
  };

  clearMessages() {
    this.showAccountBlocked = false;
    this.showIncorrectOTP = false;
    this.showOTPSent = false;
    this.showOTPExpired = false;
  }

  async resendOTP() {
    this.clearMessages();
    this.countdownMinutes = 1;
    this.countdownSeconds = 0;
    this.disableOTPBtnTemp(this.countdownMinutes * 60 * 1000);
    try {
      this.showIncorrectOTP = false;
      this.showLoader = true;
      let res: any;
      switch (sessionStorage.getItem('action')) {
        case 'login':
          {
            res = await this.userSyncService.sendLoginOTP(
              JSON.parse(sessionStorage.getItem('credentials')!),
              true
            );
          }
          break;
        case 'forgotpassword':
          {
            res = await this.userSyncService.sendForgotPasswordOTP(
              JSON.parse(sessionStorage.getItem('credentials')!)
            );
          }
          break;
      }
      if (res) {
        this.showOTPSent = true;
        this.disableOTPBtnTemp(30000);
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
      if (err.error.toString().includes('Blocked')) {
        this.showAccountBlocked = true;
        this.disableOTPBtnTemp(30000);
      }
    }
  }

  autoSubmit() {
    if (this.otpForm.otp.length == 6) {
      this.onSubmit();
    }
  }

  async verifyOtp() {
    this.clearMessages();
    try {
      this.showOTPSent = false;
      this.showLoader = true;
      let res: any;
      switch (sessionStorage.getItem('action')) {
        case 'login':
          {
            res = await this.userSyncService.login(this.otpForm.otp);
            if (res && res.token && res.token.length) {
              this.showLoader = false;
              this.router.navigate(['/dashboard']);
            } else {
              console.error(res);
              this.showLoader = false;
            }
          }
          break;
        case 'forgotpassword':
          {
            res = await this.userSyncService.verifySetNewPasswordOTP(
              this.otpForm.otp
            );
            if (res && res.token && res.token.length) {
              this.showLoader = false;
              this.router.navigate(['/set-password']);
            } else {
              console.error(res);
              this.showLoader = false;
            }
          }
          break;
      }
    } catch (err: any) {
      this.showLoader = false;
      if (err!.error.toString() == 'Incorrect OTP') {
        this.showIncorrectOTP = true;
      }
      if (err.error.toString().includes('Blocked')) {
        this.showAccountBlocked = true;
      }
      if (err.error.toString().includes('OTP has expired.')) {
        this.showOTPExpired = true;
      }
    }
  }

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
