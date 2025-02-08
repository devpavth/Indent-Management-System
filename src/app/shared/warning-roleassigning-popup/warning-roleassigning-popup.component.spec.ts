import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningRoleassigningPopupComponent } from './warning-roleassigning-popup.component';

describe('WarningRoleassigningPopupComponent', () => {
  let component: WarningRoleassigningPopupComponent;
  let fixture: ComponentFixture<WarningRoleassigningPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningRoleassigningPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarningRoleassigningPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
