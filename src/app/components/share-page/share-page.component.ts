import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharepageService } from '../../service/sharepage.service';
import { UserContent, UserContentResponse } from '../../models/share-page/UserContent.model';
import { MaterialModule } from '../../shared/material.module';
import { HighlightUserPipe } from '../../pipe/highlight-user.pipe';
import { TimeagoPipe } from '../../pipe/timeago.pipe';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { APP_AUTH_CONST, LoginMessage, LogoutAlertMessage, NullResponseErrorMessage } from '../../consts/message';
import { Routes, SecretKey } from '../../consts/const';
import { AuthService } from '../../service/auth.service';
import * as CryptoJS from 'crypto-js';
import { LoginPageComponent } from '../login-page/login-page.component';
import { AlertService } from '../../service/alert.service';
import { LandingpageService } from '../../service/landingpage.service';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';
import { QRCodeModule } from 'angularx-qrcode';
import { ShareheaderComponent } from '../headers/shareheader/shareheader.component';
import videojs from 'video.js';
@Component({
  selector: 'app-share-page',
  templateUrl: './share-page.component.html',
  styleUrls: ['./share-page.component.scss'],
  standalone: true,
  imports: [MaterialModule, HighlightUserPipe, TimeagoPipe, FormsModule, ReactiveFormsModule, QRCodeModule,
    CountdownModule, ShareheaderComponent]
})
export class SharePageComponent {
  private meta = inject(Meta);
  private dialog = inject(MatDialog);
  private activatedRoute = inject(ActivatedRoute);
  private sharepageService = inject(SharepageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  @ViewChild('videoPlayer') videoPlayer: any
  @ViewChild('videoPlayBtn') videoPlayBtn: any

  sharedContent!: any;
  isServerErr: boolean = false;
  loading!: boolean
  downloading!: boolean
  form!: FormGroup;
  responce: any;
  hide: boolean = true
  isLogin: boolean = false;
  qrLink: string = ''
  qrloading!: boolean
  isShowQRcode: boolean = false;
  userDetail: any;
  player: any

  ngOnInit(): void {
    this.isLoginCheck();
    this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
    this.activatedRoute.paramMap.subscribe(params => {
      this.isLogin = true
      const contentID: string | null = params.get('id');
      if (contentID && contentID != null) {
        this.getUserContentDetails(contentID);
      }
    });

    // this.CreateLoginForm();
  }
  getUserContentDetails(contentID: string): void {
    this.loading = true;
    this.sharepageService
      .getUserContent(contentID).subscribe({
        next: (userContentResponse: UserContentResponse) => {
          this.isServerErr = false;
          this.loading = false;
          this.sharedContent = userContentResponse;

          if (this.sharedContent.posts?.length === 0) {
            this.loading = false;
          }

          if (this.sharedContent.posts?.length !== 0) {
            this.setMetaData(this.sharedContent.posts[0]);
          }
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
  }
  onVideoClick(): void {
    const videoPlayBtn = this.videoPlayBtn;
    const videoPlayer = this.videoPlayer;
    if (videoPlayer.nativeElement.paused) {
      videoPlayBtn.nativeElement.hidden = true;
      videoPlayer.nativeElement.play();
    } else {
      videoPlayBtn.nativeElement.hidden = false;
      videoPlayer.nativeElement.pause();
    }
  }
  onVideoEnded(): void {
    const videoPlayBtn = this.videoPlayBtn;
    const videoPlayer = this.videoPlayer;
    videoPlayBtn.nativeElement.hidden = false;
    videoPlayer.nativeElement.pause();
  }

  //* VideoJS
  onVideoJSClick(mode: any): void {
    const videoPlayBtn = this.videoPlayBtn;
    if (!this.player) {
      this.player = videojs('videoPlayer-1', {
        controls: true,
        autoplay: false,
        bigPlayButton: false,
        preload: 'auto',
        techOrder: ['html5']
      });
      this.player.on('pause', () => {
        videoPlayBtn.nativeElement.hidden = false;
      });
    }
    if (this.player.paused()) {
      if (mode === 'btn') {
        this.player.play();
      } else {
        this.player.on('play', () => { });
      }
      videoPlayBtn.nativeElement.hidden = true;
    } else {
      this.player.on('pause', () => {
        videoPlayBtn.nativeElement.hidden = false;
      })
    }
  }
  onVideoJSEnded(): void {
    const videoPlayBtn = this.videoPlayBtn;
    videoPlayBtn.nativeElement.hidden = false;
    this.player.on('pause', () => { })
  }

  openLoginDialog(): void {
    if (this.isLoginCheck() === false) {
      const dialogRef = this.dialog.open(LoginPageComponent);
      dialogRef.backdropClick().subscribe(() => {
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
        this.authService.triggerShareHeader();
      });
    }
  }

  setMetaData(sharedContent: UserContent): void {
    this.meta.updateTag({ property: 'og:site_name', content: 'DubFeed' });
    this.meta.updateTag({
      property: 'og:title',
      content: sharedContent.postTitle
        ? sharedContent.postTitle
        : 'Post is unavailable or removed',
    });
    this.meta.updateTag({
      property: 'og:description',
      content: sharedContent.description ? sharedContent.description : '',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: sharedContent.thumbnailURI_Large
        ? sharedContent.thumbnailURI_Large
        : '',
    });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: sharedContent.gameTitle ? sharedContent.gameTitle : '',
    });
    this.meta.updateTag({
      property: 'og:url',
      content: sharedContent.content_URI ? sharedContent.content_URI : '',
    });
    this.meta.updateTag({ property: 'og:type', content: 'video.other' });
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ property: 'twitter:domain', content: 'DubFeed' });
    this.meta.updateTag({
      property: 'twitter:url',
      content: sharedContent.content_URI ? sharedContent.content_URI : '',
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: sharedContent.postTitle
        ? sharedContent.postTitle
        : 'Post is unavailable or removed',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: sharedContent.description ? sharedContent.description : '',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: sharedContent.thumbnailURI_Small
        ? sharedContent.thumbnailURI_Small
        : '',
    });
  }

  downloadContentWithWaterMark(contentID: string, content_URI: string): void {
    this.downloading = true
    this.sharepageService
      .downloadContentWithWaterMark(contentID).subscribe({
        next: (res: Blob) => {
          this.toastr.success(" Post Downloaded successfully. ");
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(res);
          a.href = objectUrl;
          a.download = this.getFileNameFromUrl(content_URI);
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.downloading = false;
        },
        error: (err: any) => {
          this.toastr.error(err.error.title);
          this.downloading = false;
        }
      })
  }

  onLogout(): void {
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
  }
  openQRcode(): void {
    this.router.navigate([`${Routes.qrcodelogib}`]);
  }
  isLoginCheck(): boolean {
    return this.isLogin = this.authService.getAuthUser() ? true : false;
  }

  private getFileNameFromUrl(url: string): string {
    // Remove the query string
    const cleanUrl = url.split('?')[0];
    // Get the last part of the URL path
    const fileName = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
    return fileName;
  }
}
