import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAcceptedpopupComponent } from './quote-acceptedpopup.component';

describe('QuoteAcceptedpopupComponent', () => {
  let component: QuoteAcceptedpopupComponent;
  let fixture: ComponentFixture<QuoteAcceptedpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteAcceptedpopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuoteAcceptedpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
