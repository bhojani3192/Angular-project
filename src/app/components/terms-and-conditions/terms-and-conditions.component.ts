import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { CountdownModule } from 'ngx-countdown';
import { HighlightUserPipe } from '../../pipe/highlight-user.pipe';
import { TimeagoPipe } from '../../pipe/timeago.pipe';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../service/auth.service';
import { SecretKey } from '../../consts/const';
import { LogoutAlertMessage } from '../../consts/message';
import { AlertService } from '../../service/alert.service';
import * as CryptoJS from 'crypto-js';
import { BasicheaderComponent } from '../headers/basicheader/basicheader.component';
@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [
    MaterialModule, 
    HighlightUserPipe, 
    TimeagoPipe,
    QRCodeModule,
    CountdownModule,
    RouterOutlet,
    RouterModule,
    BasicheaderComponent
  ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  route = inject(Router);
 
  ngOnInit(){
  
  }
  GotoLandingPage(){
    this.route.navigate([`/`]);
  }
}
