import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReferralComponent } from './user-referral.component';

describe('UserReferralComponent', () => {
  let component: UserReferralComponent;
  let fixture: ComponentFixture<UserReferralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserReferralComponent]
    });
    fixture = TestBed.createComponent(UserReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
