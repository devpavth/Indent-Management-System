import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIndentRequestComponent } from './edit-indent-request.component';

describe('EditIndentRequestComponent', () => {
  let component: EditIndentRequestComponent;
  let fixture: ComponentFixture<EditIndentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditIndentRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditIndentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
