import { Component, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../service/auth.service';
import { APP_AUTH_CONST, LoginMessage, OTPExpiredMessage, PasswordErrorMessage, Somethingwrongmessage, otpsendmessage, otpverificationmessage, passwordresetmessage } from '../../consts/message';
import { ToastrService } from 'ngx-toastr';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { SecretKey } from '../../consts/const';
import * as CryptoJS from 'crypto-js';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';
import { BasicheaderComponent } from '../headers/basicheader/basicheader.component';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterModule,
    NgOtpInputModule,
    CountdownModule,
    BasicheaderComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private route = inject(Router);
  form!: FormGroup;
  resetpassword!: FormGroup;
  otp!: string;
  passwordHide: boolean = true;
  confirmPasswordHide: boolean = true;
  resetToken!: string;
  loading: boolean = false;
  isSendOTP: boolean = true;
  isEnterOTP: boolean = false;
  isResetPassword: boolean = false;
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  coundownconfig = {
    leftTime: 120,
    format: 'mm:ss'
  }

  ngOnInit(): void {
    this.createSendOTPForm();
    this.createResetPasswordForm();
  }

  sendOTP(): void {
    this.authService.sendotp(this.form.value.email).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.toastr.info(otpsendmessage);
          this.isEnterOTP = true;
          this.isSendOTP = false;
          this.isResetPassword = false;
          this.countdown?.restart();
        }
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    })
  }

  onOtpChange(otp: string): void {
    this.otp = otp;
  }

  verifyOTP(): void {
    let data = {
      email: this.form.value.email,
      otp: this.otp
    }
    this.authService.verifyotp(data).subscribe({
      next: (res: any) => {
        this.resetToken = res.resetToken;
        this.toastr.info(otpverificationmessage);
        this.isResetPassword = true;
        this.isEnterOTP = false;
        this.isSendOTP = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    })
  }

  resetPassword(): void {
    let data = {
      email: this.form.value.email,
      password: this.resetpassword.value.confirmPassword,
      resetToken: this.resetToken
    }
    if (this.resetpassword.get('confirmPassword')?.value !== this.resetpassword.get('password')?.value) {
      this.toastr.error(PasswordErrorMessage);
      return;
    } else {
      if (this.resetpassword.valid) {
        this.authService.submitnewpassword(data).subscribe({
          next: (res: any) => {
            this.toastr.info(passwordresetmessage);
            this.loginWithNewPassword();
          },
          error: (err: any) => {
            this.toastr.error(err.error.message);
          }
        })
      } else {
        this.toastr.error(Somethingwrongmessage);
      }
    }

  }

  loginWithNewPassword(): void {
    let logindata = {
      email: this.form.value.email,
      password: this.resetpassword.value.confirmPassword,
    }
    this.loading = true
    this.authService.login(logindata).subscribe({
      next: (res: any) => {
        if (res) {
          this.loading = false;
          this.authService.setValueInStorage(APP_AUTH_CONST, res)
          this.route.navigate([`/`]);
          // this.toastr.success(LoginMessage);
        }
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    })
  }

  createResetPasswordForm(): void {
    const PasswordStrengthValidator = function (
      control: AbstractControl
    ): ValidationErrors | null {
      let value: string = control.value || '';

      if (!value) {
        return null;
      }

      let upperCaseCharacters = /[A-Z]+/g;
      if (upperCaseCharacters.test(value) === false) {
        return {
          passwordStrength: `text has to contine Upper case characters,current value ${value}`,
        };
      }

      let lowerCaseCharacters = /[a-z]+/g;
      if (lowerCaseCharacters.test(value) === false) {
        return {
          passwordStrength: `text has to contine lower case characters,current value ${value}`,
        };
      }

      let numberCharacters = /[0-9]+/g;
      if (numberCharacters.test(value) === false) {
        return {
          passwordStrength: `text has to contine number characters,current value ${value}`,
        };
      }

      let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (specialCharacters.test(value) === false) {
        return {
          passwordStrength: `text has to contine special character,current value ${value}`,
        };
      }
      return null;
    };
    this.resetpassword = new FormGroup({
      password: new FormControl('', [Validators.required, PasswordStrengthValidator]),
      confirmPassword: new FormControl('', [Validators.required,
        // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ])
    })
  }

  createSendOTPForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email]),
    })
  }

  coundownhandleEvent(data: any): void {
    if (data.action === 'done') {
      this.isSendOTP = true;
      this.isResetPassword = false;
      this.isEnterOTP = false;
      this.toastr.info(OTPExpiredMessage);
      // this.route.navigate([`/`]);
    }
  }
}
