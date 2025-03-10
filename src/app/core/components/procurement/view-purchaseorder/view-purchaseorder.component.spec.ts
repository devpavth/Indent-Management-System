import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseorderComponent } from './view-purchaseorder.component';

describe('ViewPurchaseorderComponent', () => {
  let component: ViewPurchaseorderComponent;
  let fixture: ComponentFixture<ViewPurchaseorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPurchaseorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPurchaseorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
