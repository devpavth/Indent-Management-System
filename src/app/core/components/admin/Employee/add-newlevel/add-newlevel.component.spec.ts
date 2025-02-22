import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewlevelComponent } from './add-newlevel.component';

describe('AddNewlevelComponent', () => {
  let component: AddNewlevelComponent;
  let fixture: ComponentFixture<AddNewlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewlevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
