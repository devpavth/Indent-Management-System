import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderlistComponent } from './purchaseorderlist.component';

describe('PurchaseorderlistComponent', () => {
  let component: PurchaseorderlistComponent;
  let fixture: ComponentFixture<PurchaseorderlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseorderlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
