import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdeletePopComponent } from './cdelete-pop.component';

describe('CdeletePopComponent', () => {
  let component: CdeletePopComponent;
  let fixture: ComponentFixture<CdeletePopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CdeletePopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CdeletePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
