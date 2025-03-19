import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCompanylogoComponent } from './upload-companylogo.component';

describe('UploadCompanylogoComponent', () => {
  let component: UploadCompanylogoComponent;
  let fixture: ComponentFixture<UploadCompanylogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadCompanylogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadCompanylogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
