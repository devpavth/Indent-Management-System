import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPoProductdetailsComponent } from './view-po-productdetails.component';

describe('ViewPoProductdetailsComponent', () => {
  let component: ViewPoProductdetailsComponent;
  let fixture: ComponentFixture<ViewPoProductdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPoProductdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPoProductdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
