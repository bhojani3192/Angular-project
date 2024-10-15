import { Component, Inject, inject } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';
import { APP_AUTH_CONST, LoginMessage, NullResponseErrorMessage } from '../../consts/message';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { XboxAuthService } from '../../service/xboxauth.service';
import { error } from 'console';
import { UserResponse } from '../../models/user/User.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ]
})
export class LoginPageComponent {
  private route = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  public dialog = inject(MatDialog);
  loginForm!: FormGroup;
  responce: any;
  loading: boolean = false;
  hide: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public contentData: any
  ) { }
  private xboxAuthService = inject(XboxAuthService);

  ngOnInit(): void {
    if (this.authService.userIsLogin()) {
      this.route.navigate(['/']);
    }
    this.createLoginForm();
  }

  onLoginClick(): void {
    if (this.loginForm.valid) {
      this.loading = true
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: UserResponse) => {
          if (res) {
            this.loading = false;
            this.authService.setValueInStorage(APP_AUTH_CONST, res);
            this.dialog.closeAll();
            this.toastr.success(LoginMessage);
            this.loginForm.reset();
          } else {
            this.loading = false;
            this.toastr.error(NullResponseErrorMessage);
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.toastr.error(err.error.message);
        }
      })
    }
  }

  onXboxLoginClick(): void {
    this.xboxAuthService.login().subscribe({
      next: (result) => {
        this.loading = true;
        if(typeof result === 'object'){
          // console.log('Login successful', result);
          this.authService.setValueInStorage(APP_AUTH_CONST, result);
          this.authService.getUserDetail().subscribe({
            next:(res:UserResponse) => {
              this.loading = false;
              localStorage.removeItem(APP_AUTH_CONST);
              res.token = result.token;
              this.authService.setValueInStorage(APP_AUTH_CONST, res);
              this.dialog.closeAll();
              this.toastr.success(LoginMessage);
            },
            error:(err:any) => {
              this.loading = false;
              this.dialog.closeAll();
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

  redirectToSignUp(): void {
    this.dialog.closeAll();
    this.route.navigate(['/signup']);
  }

  redirectToForgotpassword(): void {
    this.dialog.closeAll();
    this.route.navigate(['/forgot-password']);
  }

  private createLoginForm(): void {
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
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        PasswordStrengthValidator,
      ]),
    });
  }
}
