import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignationRoleComponent } from './view-designation-role.component';

describe('ViewDesignationRoleComponent', () => {
  let component: ViewDesignationRoleComponent;
  let fixture: ComponentFixture<ViewDesignationRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDesignationRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDesignationRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
