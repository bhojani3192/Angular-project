import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicheaderComponent } from './basicheader.component';

describe('BasicheaderComponent', () => {
  let component: BasicheaderComponent;
  let fixture: ComponentFixture<BasicheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
