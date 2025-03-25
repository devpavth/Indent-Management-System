import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPrefixComponent } from './warning-prefix.component';

describe('WarningPrefixComponent', () => {
  let component: WarningPrefixComponent;
  let fixture: ComponentFixture<WarningPrefixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningPrefixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarningPrefixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
