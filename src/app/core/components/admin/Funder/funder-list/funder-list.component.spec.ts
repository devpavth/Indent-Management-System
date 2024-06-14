import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunderListComponent } from './funder-list.component';

describe('FunderListComponent', () => {
  let component: FunderListComponent;
  let fixture: ComponentFixture<FunderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FunderListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FunderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
