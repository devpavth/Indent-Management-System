import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfPaymentModalComponent } from './mode-of-payment-modal.component';

describe('ModeOfPaymentModalComponent', () => {
  let component: ModeOfPaymentModalComponent;
  let fixture: ComponentFixture<ModeOfPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeOfPaymentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeOfPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
