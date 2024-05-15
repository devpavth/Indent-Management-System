import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessForBranchComponent } from './success-for-branch.component';

describe('SuccessForBranchComponent', () => {
  let component: SuccessForBranchComponent;
  let fixture: ComponentFixture<SuccessForBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessForBranchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessForBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
