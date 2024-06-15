import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunderService } from '../../../service/Funder/funder.service';

@Component({
  selector: 'app-view-funder',
  templateUrl: './view-funder.component.html',
  styleUrl: './view-funder.component.css',
})
export class ViewFunderComponent implements OnInit {
  @Output() closeFunderView = new EventEmitter<boolean>();
  @Input() funderData: any;
  isSave = false;
  isEdit = true;
  isSaveIcon = true;
  isDelete = false;
  updateFunderForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private funderService: FunderService,
  ) {
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
  ngOnInit(): void {
    this.updateFunderForm.patchValue(this.funderData);
    Object.keys(this.updateFunderForm.controls).forEach((form) => {
      this.updateFunderForm.get(form)?.disable();
    });
  }

  edit() {
    Object.keys(this.updateFunderForm.controls).forEach((form) => {
      this.updateFunderForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }
}
