import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadOfAccComponent } from './head-of-acc.component';

describe('HeadOfAccComponent', () => {
  let component: HeadOfAccComponent;
  let fixture: ComponentFixture<HeadOfAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadOfAccComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadOfAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
