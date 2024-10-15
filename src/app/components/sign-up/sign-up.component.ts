import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SignUp } from '../../models/signup-page/SignUp.model';
import { AuthService } from '../../service/auth.service';
import {
  APP_AUTH_CONST,
  LoginMessage,
  NullResponseErrorMessage ,
  SingUpMessage,
} from '../../consts/message';
import { Router } from '@angular/router';
import { SecretKey } from '../../consts/const';
import * as CryptoJS from 'crypto-js';
import { BasicheaderComponent } from '../headers/basicheader/basicheader.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { MatDialog } from '@angular/material/dialog';
import { XboxAuthService } from '../../service/xboxauth.service';
import { UserResponse } from '../../models/user/User.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, BasicheaderComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  route = inject(Router);
  dialog = inject(MatDialog);
  private xboxAuthService = inject(XboxAuthService);
  signUpform!: FormGroup;
  loading: boolean = false;
  passwordHide: boolean = true;
  confirmPasswordHide: boolean = true;

  ngOnInit() : void {
    if (this.authService.userIsLogin()) {
      this.route.navigate(['/']);
    }
    this.createSignUpForm();
  }

  onSignUpClick() : void {
    this.signUpform?.markAllAsTouched();
    if (this.signUpform?.valid) {
      this.loading = true;
      let signUp = this.signUpform.getRawValue() as SignUp;
      console.log(signUp);
      this.authService.signUp(signUp).subscribe({
        next: (res: any) => {
          if (res) {
            this.loading = false;
            console.log(res);
            this.toastr.success(SingUpMessage);
            this.authService.setValueInStorage(APP_AUTH_CONST, res);
            this.signUpform.reset();
            this.route.navigate([`/terms-and-conditions`]);
          } else {
            this.loading = false;
            this.toastr.error(NullResponseErrorMessage );
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.toastr.error(err?.error?.message);
        },
      });
    }
  }

  onXboxSignUpClick(): void {
    this.xboxAuthService.login().subscribe({
      next: (result) => {
        this.loading = true;
        if(typeof result === 'object'){
          this.authService.setValueInStorage(APP_AUTH_CONST, result);
          this.authService.getUserDetail().subscribe({
            next:(res:UserResponse) => {
              this.loading = false;
              res.token = result.token
              this.authService.setValueInStorage(APP_AUTH_CONST, res);
              this.route.navigate([`/`]);
              this.toastr.success(SingUpMessage);
            },
            error:(err:any) => {
              this.loading = false;
              this.toastr.error(err.error.message)
            }
          })
          
        } else {
          this.loading = false;
          this.toastr.error(result);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error);
      }
    });
  }

  redrirectToLogin() : void {
    this.route.navigate([`/`]);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginPageComponent);
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      
    });
  }
  private createSignUpForm() : void  {
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

    this.signUpform = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        PasswordStrengthValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }
}
