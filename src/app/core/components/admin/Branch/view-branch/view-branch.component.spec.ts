import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBranchComponent } from './view-branch.component';

describe('ViewBranchComponent', () => {
  let component: ViewBranchComponent;
  let fixture: ComponentFixture<ViewBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBranchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
