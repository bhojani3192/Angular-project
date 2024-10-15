import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, TemplateRef, ViewChild, ViewChildren, inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { ToastrService } from 'ngx-toastr';
import { TopCategoryContentResponse } from '../../models/landing-page/TopCategoryContent.model';
import { LandingpageService } from '../../service/landingpage.service';
import { MaterialModule } from '../../shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoginPageComponent } from '../login-page/login-page.component';
import { AuthService } from '../../service/auth.service';
import { APP_AUTH_CONST, LoginMessage, LogoutAlertMessage, NullResponseErrorMessage } from '../../consts/message';
import { Routes, SecretKey } from '../../consts/const';
import * as CryptoJS from 'crypto-js';
import { AlertService } from '../../service/alert.service';
import { QRCodeModule } from 'angularx-qrcode';
import { CountdownComponent, CountdownModule } from 'ngx-countdown';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from '../../interceptor/interceptor.interceptor';
import { Router } from '@angular/router';
import { LandingpageheaderComponent } from '../headers/landingpageheader/landingpageheader.component';
import { IMAGE_CONFIG } from '@angular/common';
import videojs from 'video.js';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    CountdownModule,
    LandingpageheaderComponent
  ]
})
export class LandingPageComponent {
  private fb = inject(FormBuilder);
  private landingpageService = inject(LandingpageService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  public dialog = inject(MatDialog);
  private router = inject(Router);

  expanded: boolean[] = [false, false, false, false];
  earlyAccessForm!: FormGroup;
  disabledbtn!: boolean;
  loading!: boolean;
  loadingsmall!: boolean;
  slides: TopCategoryContentResponse[] = [];
  isVideo: boolean = true;
  isImage: boolean = false;
  isVideobtn: boolean = true;
  isShowContactus: boolean = false;
  isShowQRcode: boolean = false;
  isShowIndividual: boolean = true;
  isShowGameClips: boolean = true;
  isLogin: boolean = false;
  hide: boolean = true;
  isTopData: boolean = true;
  qrLink: string = ''
  qrloading!: boolean
  player: any

  @ViewChildren('videoPlayer') videoPlayers!: QueryList<any>;
  @ViewChildren('videoPlayBtn') videoPlayBtns!: QueryList<ElementRef>;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;
  @ViewChild('LoginDialog') LoginDialog!: TemplateRef<any>;

  Questions = [
    {
      question: 'Is there a cost to using DubFeed?',
      ans: 'DubFeed is completely free during the trial period. Even though upgrade options may show a cost, there is no charge or need to enter payment information after upgrading during this time.After the full launch, there will always be a free account option, and additional benefits and account tiers will be detailed on this page.',
    },
    {
      question:
        'Do other gamers have to use DubFeed for me to connect with them?',
      ans: "No, they don't. You can use the Gamertag search option to find any Xbox user, whether theyuse DubFeed or not. You can view their recently played games and invite them to the platform.Connecting with users on other gaming platforms is coming soon.",
    },
    {
      question:
        'How can I use DubFeed to replace OneDrive or other existing storage systems?',
      ans: 'To gain additional storage space, go to your profile screen, select "Upgrade," and choose either the DubFeed Standard or DubFeed Premium account tiers. On the DubFeed tab of your profile screen choose "GameClips" or "Screenshots" to access the "Upload Clip" option.',
    },
    {
      question: 'Which gaming platforms are currently supported?',
      ans: 'DubFeed currently supports any previously recorded gaming content through the upload clip option. The initial version includes a direct link to Xbox Live content, enabling fully automated synchronization. Future updates will add support for live links to other gaming consoles and gaming studios.',
    },
  ];
  quotes = [
    {
      profile:
        'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTcS9jr0n8i7LY1tL3U7AiafXOJXII2MjBA_JfetLjYyALbQPVhvIyVYExKdpkzFuYT&format=png',
      quote: 'This is what the Xbox app should have been the whole time',
      gamertag: 'Louis Celestin',
    },
    {
      profile:
        'https://images-eds-ssl.xboxlive.com/image?url=z951ykn43p4FqWbbFvR2Ec.8vbDhj8G2Xe7JngaTToBrrCmIEEXHC9UNrdJ6P7KIbgsfD63mXFU_1J9M4K4P9ENjIaO633OvoJuMUTLcpuYjkQ2JWmMQ0qYjmoCKuuuD&format=png',
      quote:
        'An innovative social platform that allows you to store and share all your best game clips with ease',
      gamertag: 'Secloading',
    },
    {
      profile:
        'https://images-eds-ssl.xboxlive.com/image?url=_ypRc.tDkw6ssGJei7uFnjPBFhPKOw9luaoEyDH5ID4hKQeLSM6t5EnoYLpobrjplb1qK_JV1PME26przUjZ0rIr_KhneqOLUjZ9Yh0W24g-&background=0xababab&format=png',
      quote:
        'No need for multiple apps! Edit, download, and share all from one seamless platform. 10/10',
      gamertag: 'Buggy55',
    },
    {
      profile:
        'https://images-eds-ssl.xboxlive.com/image?url=z951ykn43p4FqWbbFvR2Ec.8vbDhj8G2Xe7JngaTToBrrCmIEEXHC9UNrdJ6P7KIAbCDABRYREOfuoy2FOUr6ikRPLqld120ldblK2tGNZDXKQaT_VZJh4gOB9C7zZdQ&format=png',
      quote:
        'Great spot to doomscroll videos of your friends clutching up in the 1 v 3',
      gamertag: 'thatxxguy',
    },
  ];
  currentIndex: any = 0;
  responce: any;
  userID: any;
  userDetail: any;

  ngOnInit(): void {
    this.earlyAccessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      deviceType: ['1', [Validators.required]],
    });
    this.getTopCategoryContents();
    this.isLoginCheck();
    this.userDetail = this.authService.getValueFromStorage(APP_AUTH_CONST);
  }

  ngAfterViewInit(): void {
    this.pauseAllVideos(0);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    if (this.isShowContactus && !event?.target?.parentElement?.classList?.contains('contact-btn')) {
      this.isShowContactus = false;
    }
    event.stopPropagation();
  }

  getEarlyAccess(): void {
    if (this.earlyAccessForm.valid) {
      this.loadingsmall = true;
      let data = {
        email: this.earlyAccessForm.value.email,
        deviceType: Number(this.earlyAccessForm.value.deviceType),
      };
      this.landingpageService
        .sendEarlyAccessRequest(data)
        .subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.toastr.success(res.message);
              this.earlyAccessForm.reset({ deviceType: '1' });
              this.loadingsmall = false;
            }
          },
          error: (err: any) => {
            this.disabledbtn = false;
            this.loadingsmall = false;
            this.toastr.error(err.error.message);
          },
        });
    }
  }

  getTopCategoryContents(): void {
    this.landingpageService.getTopCategoryContents().subscribe({
      next: (topCategoryContentResponses: TopCategoryContentResponse[]) => {
        this.slides = topCategoryContentResponses;
        if (this.slides.length === 0) {
          this.isTopData = false;
        } else {
          this.isTopData = true;
        }
      },
      error: (err: any) => {
        this.isTopData = false;
        this.toastr.error(err.error.message);
      }
    })
  }

  togglePanel(index: number): void {
    for (let i = 0; i < this.expanded.length; i++) {
      if (i === index) {
        this.expanded[i] = !this.expanded[i];
      } else {
        this.expanded[i] = false;
      }
    }
  }

  slides2 = [
    { content_URI: '/assets/images/Rectangle 4.png' },
    { content_URI: '/assets/images/sublayerimg.png' },
    { content_URI: '/assets/images/sublayer-2.png' },
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: '26%',
    responsive: [
      {
        breakpoint: 3000,
        settings: {
          centerPadding: '32%',
        },
      },

      {
        breakpoint: 2000,
        settings: {
          centerPadding: '30%',
        },
      },
      
      {
        breakpoint: 1600,
        settings: {
          centerPadding: '26%',
        },
      },

      {
        breakpoint: 1199,
        settings: {
          centerPadding: '20%',
        },
      },
      {
        breakpoint: 991,
        settings: {
          centerPadding: '10%',
        },

      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '15%',
        },
      },
      {
        breakpoint: 450,
        settings: {
          centerPadding: '5%',
        },

      }
    ]
  };

  onAfterChange(event: any): void {
    const currentIndex = event.currentSlide;
    this.pauseAllVideos(currentIndex);
  }

  slickInit(event: any): void {
    const videoPlayBtn = this.videoPlayBtns.toArray();
    videoPlayBtn.forEach((btn, index) => {
      btn.nativeElement.hidden = index !== 0;  
    });
  }

  onVideoClick(currentIndex: number): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    const videoPlayer = this.videoPlayers.toArray()[currentIndex];
    if (videoPlayBtn.nativeElement.hidden === false || videoPlayer.nativeElement.paused === false) {
      this.playVideoAtIndex(currentIndex);
    }
  }

  onPlayBtnClick(currentIndex: number): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    if (videoPlayBtn.nativeElement.hidden === false) {
      this.playVideoAtIndex(currentIndex);
    }
  }

  onVideoEnded(currentIndex: number): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    const videoPlayer = this.videoPlayers.toArray()[currentIndex];
    videoPlayBtn.nativeElement.hidden = false;
    videoPlayer.nativeElement.pause();
  }

  pauseAllVideos(currentIndex: number): void {
    this.videoPlayers.forEach((video, index) => {
      if (currentIndex != index) {
        video.nativeElement.pause();
      }
    });
    this.videoPlayBtns.forEach((btn, index) => {
      if (currentIndex == index) {
        btn.nativeElement.hidden = false;
      } else {
        btn.nativeElement.hidden = true;
      }
    });
  }

  playVideoAtIndex(currentIndex: number): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    const videoPlayer = this.videoPlayers.toArray()[currentIndex];

    if (videoPlayer.nativeElement.paused) {
      videoPlayBtn.nativeElement.hidden = true;
      videoPlayer.nativeElement.play();
    } else {
      videoPlayBtn.nativeElement.hidden = false;
      videoPlayer.nativeElement.pause();
    }
  }

  //*videoJS
  // onVideoJSClick(currentIndex: number): void {
  //   const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
  //   const videoPlayer = this.videoPlayers.toArray()[currentIndex];
  //   this.player = videojs('videoPlayer-' + currentIndex,
  //     {
  //       controls: true,
  //       autoplay: false,
  //       bigPlayButton:false,
  //       preload: 'auto',
  //       techOrder: ['html5']
  //     }
  //   )
  //   if (videoPlayBtn.nativeElement.hidden === false || this.player.paused() === false) {
  //     this.playVideoJSAtIndex(currentIndex,'video');
  //   }
  // }
  onVideoJSClick(currentIndex: number): void {
    this.initializePlayer(currentIndex);
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    if (this.player.paused()) {
      // this.player.play();  
      this.player.on('play', () => {
        videoPlayBtn.nativeElement.hidden = true;
      });
    } else {
      this.player.on('pause', () => {
        videoPlayBtn.nativeElement.hidden = false;
      });
    }
  }

  initializePlayer(currentIndex: number): void {
    if (!this.player || this.player.id() !== 'videoPlayer-' + currentIndex) {
      this.player = videojs('videoPlayer-' + currentIndex, {
        controls: true,
        autoplay: false,
        bigPlayButton: false,
        preload: 'auto',
        techOrder: ['html5']
      });

      // Ensure to set up event listeners right after initialization  
      const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
      this.player.on('play', () => {
        videoPlayBtn.nativeElement.hidden = true;
      });

      this.player.on('pause', () => {
        videoPlayBtn.nativeElement.hidden = false;
      });
    }
  }

  onVideoJSPlayBtnClick(currentIndex: number): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    if (videoPlayBtn.nativeElement.hidden === false) {
      this.playVideoJSAtIndex(currentIndex, 'btn');
    }
  }

  onVideoJSEnded(currentIndex: number): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    const videoPlayer = this.videoPlayers.toArray()[currentIndex];
    videoPlayBtn.nativeElement.hidden = false;
    this.player.pause();
  }

  playVideoJSAtIndex(currentIndex: number, mode: any): void {
    const videoPlayBtn = this.videoPlayBtns.toArray()[currentIndex];
    const videoPlayer = this.videoPlayers.toArray()[currentIndex];
    // this.player = videojs('videoPlayer-' + currentIndex,
    //   {
    //     controls: true,
    //     autoplay: false,
    //     bigPlayButton:false,
    //     preload: 'auto',
    //     techOrder: ['html5']
    //   }
    // )
    this.initializePlayer(currentIndex)
    if (this.player.paused()) {
      videoPlayBtn.nativeElement.hidden = true;
      if (mode === 'btn') {
        this.player.play();
      } else {
        this.player.on('play', () => { });
      }
    } else {
      videoPlayBtn.nativeElement.hidden = false;
      if (mode === 'btn') {
        this.player.pause();
      } else {
        this.player.on('pause', () => { });
      }
      // this.player.on('pause',() => {})
      // this.player.pause();
    }
  }

  onClickFocusEmailInput(number: any): void {
    this.emailInput.nativeElement.focus();
    this.earlyAccessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      deviceType: [number, [Validators.required]],
    });
  }
  isShowContactusToggle(): void {
    this.isShowContactus = !this.isShowContactus
  }
  OpenQRcode(): void {
    this.router.navigate([`${Routes.qrcodelogib}`])
  }
  openLoginDialog(): void {
    if (this.isLoginCheck() === false) {
      const dialogRef = this.dialog.open(LoginPageComponent);
      dialogRef.backdropClick().subscribe(() => {
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    }
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

  }

  isLoginCheck(): boolean {
    return this.isLogin = this.authService.getAuthUser() ? true : false;
  }

}
