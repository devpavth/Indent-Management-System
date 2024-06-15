import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundaddComponent } from './fundadd.component';

describe('FundaddComponent', () => {
  let component: FundaddComponent;
  let fixture: ComponentFixture<FundaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
