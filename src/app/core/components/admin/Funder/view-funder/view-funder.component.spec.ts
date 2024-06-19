import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFunderComponent } from './view-funder.component';

describe('ViewFunderComponent', () => {
  let component: ViewFunderComponent;
  let fixture: ComponentFixture<ViewFunderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFunderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFunderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
