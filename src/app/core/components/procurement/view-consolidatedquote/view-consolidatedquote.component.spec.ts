import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsolidatedquoteComponent } from './view-consolidatedquote.component';

describe('ViewConsolidatedquoteComponent', () => {
  let component: ViewConsolidatedquoteComponent;
  let fixture: ComponentFixture<ViewConsolidatedquoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewConsolidatedquoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewConsolidatedquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
