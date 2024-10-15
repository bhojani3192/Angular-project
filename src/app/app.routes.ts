import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { UserReferralComponent } from './components/user-referral/user-referral.component';
import { SharePageComponent } from './components/share-page/share-page.component';
import { QrcodePageComponent } from './components/qrcode-page/qrcode-page.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'share/:id',
    component: SharePageComponent
  },
  {
    path: 'referral/:id',
    component: UserReferralComponent,
  },
  {
    path: 'qrcode/:id',
    component: QrcodePageComponent
  },
  {
    path:'qrcode-login',
    component:QrCodeComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path:'terms-and-conditions',
    component:TermsAndConditionsComponent
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  }
];
