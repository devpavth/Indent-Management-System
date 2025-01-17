import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramManagerApprovalComponent } from './program-manager-approval.component';

describe('ProgramManagerApprovalComponent', () => {
  let component: ProgramManagerApprovalComponent;
  let fixture: ComponentFixture<ProgramManagerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramManagerApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramManagerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
