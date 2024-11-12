import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBranchDetailsComponent } from './confirm-branch-details.component';

describe('ConfirmBranchDetailsComponent', () => {
  let component: ConfirmBranchDetailsComponent;
  let fixture: ComponentFixture<ConfirmBranchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmBranchDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmBranchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
