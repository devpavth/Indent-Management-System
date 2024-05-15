import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApprovelComponent } from './admin-approvel.component';

describe('AdminApprovelComponent', () => {
  let component: AdminApprovelComponent;
  let fixture: ComponentFixture<AdminApprovelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminApprovelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminApprovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
