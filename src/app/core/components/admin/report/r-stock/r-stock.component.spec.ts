import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStockComponent } from './r-stock.component';

describe('RStockComponent', () => {
  let component: RStockComponent;
  let fixture: ComponentFixture<RStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
