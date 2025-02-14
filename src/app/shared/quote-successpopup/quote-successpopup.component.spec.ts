import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSuccesspopupComponent } from './quote-successpopup.component';

describe('QuoteSuccesspopupComponent', () => {
  let component: QuoteSuccesspopupComponent;
  let fixture: ComponentFixture<QuoteSuccesspopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteSuccesspopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuoteSuccesspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
