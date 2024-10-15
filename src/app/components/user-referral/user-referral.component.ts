import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-referral',
  templateUrl: './user-referral.component.html',
  styleUrls: ['./user-referral.component.scss'],
  standalone: true
})
export class UserReferralComponent {
  copied = false;
  text!: string;

 constructor(
  private route: ActivatedRoute,
  private clipboard: Clipboard
 ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.text = params.get('id') || '0';
    })
  }

  copyToClipboard(){
    this.clipboard.copy(this.text);
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }
}
