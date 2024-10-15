import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageheaderComponent } from './landingpageheader.component';

describe('LandingpageheaderComponent', () => {
  let component: LandingpageheaderComponent;
  let fixture: ComponentFixture<LandingpageheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingpageheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingpageheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
