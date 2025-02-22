import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewdesignationComponent } from './add-newdesignation.component';

describe('AddNewdesignationComponent', () => {
  let component: AddNewdesignationComponent;
  let fixture: ComponentFixture<AddNewdesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewdesignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewdesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
