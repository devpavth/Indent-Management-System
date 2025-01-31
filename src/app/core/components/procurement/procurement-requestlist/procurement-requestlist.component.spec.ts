import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementRequestlistComponent } from './procurement-requestlist.component';

describe('ProcurementRequestlistComponent', () => {
  let component: ProcurementRequestlistComponent;
  let fixture: ComponentFixture<ProcurementRequestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcurementRequestlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcurementRequestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
