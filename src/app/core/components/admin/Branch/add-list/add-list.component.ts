import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css',
})
export class AddListComponent {
  departmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({});
  }
}
