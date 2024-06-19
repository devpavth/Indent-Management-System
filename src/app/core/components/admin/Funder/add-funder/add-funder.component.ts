import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunderService } from '../../../service/Funder/funder.service';

@Component({
  selector: 'app-add-funder',
  templateUrl: './add-funder.component.html',
  styleUrl: './add-funder.component.css',
})
export class AddFunderComponent {
  funderForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private funderService: FunderService,
  ) {
    this.funderForm = this.fb.group({
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
  onSubmit(data: any) {
    console.log(data);
    this.funderService.registerFunder(data).subscribe((res) => {
      console.log(res);
    });
  }
}
