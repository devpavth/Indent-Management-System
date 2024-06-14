import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-funder',
  templateUrl: './view-funder.component.html',
  styleUrl: './view-funder.component.css',
})
export class ViewFunderComponent {
  @Output() closeFunderPop = new EventEmitter<boolean>();

  isSave = false;
  isEdit = true;
  isSaveIcon = true;
  isDelete = false;
  updateFunderForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.updateFunderForm = this.fb.group({
      funderName: ['', Validators.required],
      funderCatg: ['', Validators.required],
      funderAdd1: ['', Validators.required],
      funderAdd2: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      contactNumber: [
        ,
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      emailId: ['', [Validators.required, Validators.email]],
      funderstatus: [200],
    });
  }
  closeFunderView() {
    this.closeFunderPop.emit(false);
  }
  edit() {
    Object.keys(this.updateFunderForm.controls).forEach((form) => {
      this.updateFunderForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }
}
