import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcurementreqComponent } from './view-procurementreq.component';

describe('ViewProcurementreqComponent', () => {
  let component: ViewProcurementreqComponent;
  let fixture: ComponentFixture<ViewProcurementreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewProcurementreqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProcurementreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
