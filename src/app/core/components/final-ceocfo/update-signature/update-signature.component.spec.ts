import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSignatureComponent } from './update-signature.component';

describe('UpdateSignatureComponent', () => {
  let component: UpdateSignatureComponent;
  let fixture: ComponentFixture<UpdateSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateSignatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
