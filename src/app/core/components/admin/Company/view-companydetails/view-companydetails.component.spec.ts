import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanydetailsComponent } from './view-companydetails.component';

describe('ViewCompanydetailsComponent', () => {
  let component: ViewCompanydetailsComponent;
  let fixture: ComponentFixture<ViewCompanydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCompanydetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCompanydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
