import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModeOfPaymentComponent } from './add-mode-of-payment.component';

describe('AddModeOfPaymentComponent', () => {
  let component: AddModeOfPaymentComponent;
  let fixture: ComponentFixture<AddModeOfPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModeOfPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddModeOfPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
