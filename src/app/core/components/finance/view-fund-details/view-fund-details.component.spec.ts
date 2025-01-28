import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFundDetailsComponent } from './view-fund-details.component';

describe('ViewFundDetailsComponent', () => {
  let component: ViewFundDetailsComponent;
  let fixture: ComponentFixture<ViewFundDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFundDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
