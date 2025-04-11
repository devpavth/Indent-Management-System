import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCompanylogoComponent } from './preview-companylogo.component';

describe('PreviewCompanylogoComponent', () => {
  let component: PreviewCompanylogoComponent;
  let fixture: ComponentFixture<PreviewCompanylogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewCompanylogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewCompanylogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
