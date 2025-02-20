import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockreportBranchComponent } from './stockreport-branch.component';

describe('StockreportBranchComponent', () => {
  let component: StockreportBranchComponent;
  let fixture: ComponentFixture<StockreportBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockreportBranchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockreportBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
