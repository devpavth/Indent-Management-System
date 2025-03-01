import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentreportsComponent } from './indentreports.component';

describe('IndentreportsComponent', () => {
  let component: IndentreportsComponent;
  let fixture: ComponentFixture<IndentreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndentreportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndentreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
