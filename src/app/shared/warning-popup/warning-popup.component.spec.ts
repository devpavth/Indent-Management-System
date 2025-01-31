import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPopupComponent } from './warning-popup.component';

describe('WarningPopupComponent', () => {
  let component: WarningPopupComponent;
  let fixture: ComponentFixture<WarningPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarningPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
