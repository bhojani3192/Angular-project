import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../service/alert.service';
import { AuthService } from '../../../service/auth.service';
import { LoginPageComponent } from '../../login-page/login-page.component';
import { Router } from '@angular/router';
import { Routes, SecretKey } from '../../../consts/const';
import * as CryptoJS from 'crypto-js';
import { MaterialModule } from '../../../shared/material.module';
import { APP_AUTH_CONST, LogoutAlertMessage } from '../../../consts/message';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-shareheader',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './shareheader.component.html',
  styleUrl: './shareheader.component.scss'
})
export class ShareheaderComponent {
  public loginDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private route = inject(Router);
  private toastr = inject(ToastrService)
  isLogin: boolean = false;
  userDetail: any;


  ngOnInit() : void {
    this.authService.refreshShareHeaderComponent$.subscribe(() => {
      this.isLoginCheck();
      this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
    });
    this.isLoginCheck();
    this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
  }

  opneDialog() : void {
    if (this.isLoginCheck() === false) {
      const dialogRef = this.loginDialog.open(LoginPageComponent);
      dialogRef.backdropClick().subscribe(() => {
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        this.isLoginCheck();
        this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
      });
    }
  }

  redirectToSignUpPage() : void {
    this.route.navigate(['/signup']);
  }

  openQRcode() : void {
    this.route.navigate([`${Routes.qrcodelogib}`]);
  }

  onLogoutClick() : void {
    this.authService.onUserLogout().subscribe({
      next: (isLoggedOut: boolean) => {
        if (isLoggedOut) {
          this.isLogin = false;
          this.toastr.success('You have successfully logged out.');
          this.isLoginCheck();

          // this.router.navigate(['/']);  // Redirect to home or login page
        }
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toastr.error('An error occurred during logout.');
      },
    });

  }
  isLoginCheck() : boolean {
    return this.isLogin = this.authService.getAuthUser() ? true : false;
  }
}
