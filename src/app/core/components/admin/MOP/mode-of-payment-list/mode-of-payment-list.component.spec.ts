import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfPaymentListComponent } from './mode-of-payment-list.component';

describe('ModeOfPaymentListComponent', () => {
  let component: ModeOfPaymentListComponent;
  let fixture: ComponentFixture<ModeOfPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeOfPaymentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeOfPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
