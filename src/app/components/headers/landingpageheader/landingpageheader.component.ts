import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { LoginPageComponent } from '../../login-page/login-page.component';
import { MatDialog } from '@angular/material/dialog';
import { Routes, SecretKey } from '../../../consts/const';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../service/alert.service';
import { ToastrService } from 'ngx-toastr';
import { APP_AUTH_CONST } from '../../../consts/message';
@Component({
  selector: 'app-landingpageheader',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './landingpageheader.component.html',
  styleUrl: './landingpageheader.component.scss'
})
export class LandingpageheaderComponent {
  public loginDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  isShowContactus: boolean = false;
  isLogin: boolean = false;
  userDetail: any;

  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit() : void {
    this.isLoginCheck();
    this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
  }

  isShowContactusToggle(): void {
    this.isShowContactus = !this.isShowContactus;
  }

  openLoginDialog(): void {
    if (this.isLoginCheck() === false) {
      const dialogRef = this.loginDialog.open(LoginPageComponent);
      dialogRef.backdropClick().subscribe(() => {
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        if(this.isLoginCheck()){
          this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST); 
          this.cdr.markForCheck(); 
        }
      });

    }
  }

  openQRcode(): void {
    this.router.navigate([`${Routes.qrcodelogib}`]);
  }
   
  onLogoutClick(): void {
    this.authService.onUserLogout().subscribe({
      next: (isLoggedOut: boolean) => {
        if (isLoggedOut) {
          this.isLogin = false;
          this.toastr.success('You have successfully logged out.');
          // this.router.navigate(['/']);  // Redirect to home or login page
        }
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toastr.error('An error occurred during logout.');
      },
    });
    // this.isLoginCheck();
  }

  isLoginCheck() : boolean {
    return this.isLogin = this.authService.getAuthUser() ? true : false;
  }
}
