import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcceptedprocurementreqComponent } from './view-acceptedprocurementreq.component';

describe('ViewAcceptedprocurementreqComponent', () => {
  let component: ViewAcceptedprocurementreqComponent;
  let fixture: ComponentFixture<ViewAcceptedprocurementreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAcceptedprocurementreqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAcceptedprocurementreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
