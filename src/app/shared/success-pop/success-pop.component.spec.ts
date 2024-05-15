import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPopComponent } from './success-pop.component';

describe('SuccessPopComponent', () => {
  let component: SuccessPopComponent;
  let fixture: ComponentFixture<SuccessPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessPopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
