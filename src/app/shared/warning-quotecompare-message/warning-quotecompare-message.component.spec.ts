import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningQuotecompareMessageComponent } from './warning-quotecompare-message.component';

describe('WarningQuotecompareMessageComponent', () => {
  let component: WarningQuotecompareMessageComponent;
  let fixture: ComponentFixture<WarningQuotecompareMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningQuotecompareMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarningQuotecompareMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
