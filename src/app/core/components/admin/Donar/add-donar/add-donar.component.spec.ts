import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDonarComponent } from './add-donar.component';

describe('AddDonarComponent', () => {
  let component: AddDonarComponent;
  let fixture: ComponentFixture<AddDonarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDonarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDonarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
