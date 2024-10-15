import { Component, ViewChild, inject } from '@angular/core';
import { APP_AUTH_CONST, LogoutAlertMessage } from '../../consts/message';
import { AlertService } from '../../service/alert.service';
import { Routes, SecretKey } from '../../consts/const';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';
import { HighlightUserPipe } from '../../pipe/highlight-user.pipe';
import { TimeagoPipe } from '../../pipe/timeago.pipe';
import { MaterialModule } from '../../shared/material.module';
import * as CryptoJS from 'crypto-js';
import { LandingpageService } from '../../service/landingpage.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [
    MaterialModule,
    HighlightUserPipe,
    TimeagoPipe,
    QRCodeModule,
    CountdownModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QrCodeComponent {
  private router = inject(Router);
  private landingpageService = inject(LandingpageService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  userDetail: any;
  loading!: boolean;
  qrLink: string = '';
  coundownconfig = {
    leftTime: 300,
    format: 'mm:ss'
  }

  ngOnInit(): void {
    this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
    this.generateQRLoginCode();
  }

  generateQRLoginCode(): void {
    this.loading = true
    if(this.userDetail){
    this.landingpageService.generateQRLoginCode().subscribe({
      next: (res: any) => {
        let code = res.message;
        this.qrLink = `https://www.dubfeed.com/qrcode/${code}`;
        this.loading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error.message);
      }
    })
    } else {
      this.router.navigate([`/`])
    }
  }
  onLogout(): void {
    this.authService.onUserLogout().subscribe({
      next: (isLoggedOut: boolean) => {
        if (isLoggedOut) {
          this.toastr.success('You have successfully logged out.');
          this.router.navigate([`${Routes.Landingpage}`])
          // this.router.navigate(['/']);  // Redirect to home or login page
        }
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toastr.error('An error occurred during logout.');
      },
    });
  }

  handleEvent(data: any): void {
    if (data.action === 'done') {
      this.generateQRLoginCode();
      this.countdown.restart();
    }
  }
}
