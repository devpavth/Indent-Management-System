import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFundbranchreasonComponent } from './view-fundbranchreason.component';

describe('ViewFundbranchreasonComponent', () => {
  let component: ViewFundbranchreasonComponent;
  let fixture: ComponentFixture<ViewFundbranchreasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFundbranchreasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFundbranchreasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
