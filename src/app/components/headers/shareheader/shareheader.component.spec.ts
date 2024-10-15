import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareheaderComponent } from './shareheader.component';

describe('ShareheaderComponent', () => {
  let component: ShareheaderComponent;
  let fixture: ComponentFixture<ShareheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
