import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatelevelFordesignationComponent } from './updatelevel-fordesignation.component';

describe('UpdatelevelFordesignationComponent', () => {
  let component: UpdatelevelFordesignationComponent;
  let fixture: ComponentFixture<UpdatelevelFordesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatelevelFordesignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatelevelFordesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
