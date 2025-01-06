import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardAlertComponent } from './inward-alert.component';

describe('InwardAlertComponent', () => {
  let component: InwardAlertComponent;
  let fixture: ComponentFixture<InwardAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InwardAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InwardAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
