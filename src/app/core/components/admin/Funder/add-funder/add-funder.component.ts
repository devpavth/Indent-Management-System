import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunderService } from '../../../service/Funder/funder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-funder',
  templateUrl: './add-funder.component.html',
  styleUrl: './add-funder.component.css',
})
export class AddFunderComponent {
  isSuccess: boolean = false;
  successData: any;

  private route = inject(Router);

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
    console.log("posting funder form value:", data);
    this.funderService.registerFunder(data).subscribe((res: any) => {
      console.log("successfully saved the funder value:", res);
      this.isSuccess = true;
      this.successData = { show: 5, text: res.errorMessege };
      console.log("this.successData:", this.successData);
    },(error) => {
      console.log("error while saving the funder value:", error);
    }); 
  }

  closeSuccess(data: boolean) {
    this.isSuccess = data;
    // this.resetComponent();
    this.route.navigate(['/home/funderList']);
  }
}
