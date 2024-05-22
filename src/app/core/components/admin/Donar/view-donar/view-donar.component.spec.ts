import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDonarComponent } from './view-donar.component';

describe('ViewDonarComponent', () => {
  let component: ViewDonarComponent;
  let fixture: ComponentFixture<ViewDonarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDonarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDonarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
