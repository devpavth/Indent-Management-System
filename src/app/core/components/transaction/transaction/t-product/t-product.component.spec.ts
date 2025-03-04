import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TProductComponent } from './t-product.component';

describe('TProductComponent', () => {
  let component: TProductComponent;
  let fixture: ComponentFixture<TProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
