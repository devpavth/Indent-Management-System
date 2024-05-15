import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteToastComponent } from './delete-toast.component';

describe('DeleteToastComponent', () => {
  let component: DeleteToastComponent;
  let fixture: ComponentFixture<DeleteToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
