import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFunderComponent } from './add-funder.component';

describe('AddFunderComponent', () => {
  let component: AddFunderComponent;
  let fixture: ComponentFixture<AddFunderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFunderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFunderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
