import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMappingComponent } from './role-mapping.component';

describe('RoleMappingComponent', () => {
  let component: RoleMappingComponent;
  let fixture: ComponentFixture<RoleMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
