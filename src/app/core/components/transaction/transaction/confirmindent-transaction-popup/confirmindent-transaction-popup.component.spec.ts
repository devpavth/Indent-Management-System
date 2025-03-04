import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmindentTransactionPopupComponent } from './confirmindent-transaction-popup.component';

describe('ConfirmindentTransactionPopupComponent', () => {
  let component: ConfirmindentTransactionPopupComponent;
  let fixture: ComponentFixture<ConfirmindentTransactionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmindentTransactionPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmindentTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
