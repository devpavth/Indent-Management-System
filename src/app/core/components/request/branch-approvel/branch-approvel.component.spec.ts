import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchApprovelComponent } from './branch-approvel.component';

describe('BranchApprovelComponent', () => {
  let component: BranchApprovelComponent;
  let fixture: ComponentFixture<BranchApprovelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BranchApprovelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchApprovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
