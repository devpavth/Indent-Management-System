import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePopComponent } from './delete-pop.component';

describe('DeletePopComponent', () => {
  let component: DeletePopComponent;
  let fixture: ComponentFixture<DeletePopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
