import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewceoCfoapprovalRequisitionComponent } from './viewceo-cfoapproval-requisition.component';

describe('ViewceoCfoapprovalRequisitionComponent', () => {
  let component: ViewceoCfoapprovalRequisitionComponent;
  let fixture: ComponentFixture<ViewceoCfoapprovalRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewceoCfoapprovalRequisitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewceoCfoapprovalRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
