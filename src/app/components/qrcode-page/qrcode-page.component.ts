import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../service/alert.service';
import { AuthService } from '../../service/auth.service';
import { SharepageService } from '../../service/sharepage.service';
import { LandingpageService } from '../../service/landingpage.service';
import { Routes } from '../../consts/const';

@Component({
  selector: 'app-qrcode-page',
  standalone: true,
  imports: [],
  templateUrl: './qrcode-page.component.html',
  styleUrl: './qrcode-page.component.scss'
})
export class QrcodePageComponent {
  private route = inject(ActivatedRoute);
  private landingpageService = inject(LandingpageService)
  private toastr = inject(ToastrService);
  private router = inject(Router);
  code!: string | null;

  ngOnInit() : void {
    this.route.paramMap.subscribe(params => {
      this.code = params.get('id')
      this.onLoginWithCode(this.code)
    })
  }

  onLoginWithCode(code:any) : void {
    this.landingpageService.loginWithCode(code).subscribe({
      next:(res:any) => {
        this.router.navigate([`${Routes.Landingpage}`]);
      },
      error:(err: any) => {
        this.toastr.error(err.error.message);
      }
    });
  }
}
