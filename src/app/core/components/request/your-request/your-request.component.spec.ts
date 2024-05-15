import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourRequestComponent } from './your-request.component';

describe('YourRequestComponent', () => {
  let component: YourRequestComponent;
  let fixture: ComponentFixture<YourRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YourRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
