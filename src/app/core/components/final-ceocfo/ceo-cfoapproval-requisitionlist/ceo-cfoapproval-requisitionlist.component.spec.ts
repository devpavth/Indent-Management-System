import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoCfoapprovalRequisitionlistComponent } from './ceo-cfoapproval-requisitionlist.component';

describe('CeoCfoapprovalRequisitionlistComponent', () => {
  let component: CeoCfoapprovalRequisitionlistComponent;
  let fixture: ComponentFixture<CeoCfoapprovalRequisitionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CeoCfoapprovalRequisitionlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CeoCfoapprovalRequisitionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
