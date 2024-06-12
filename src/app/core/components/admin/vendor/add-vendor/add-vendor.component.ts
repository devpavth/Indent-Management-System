import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.css',
})
export class AddVendorComponent {
  addVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
  ) {
    this.addVendorForm = this.fb.group({
      vendorName: [],
      vdrAdd1: [],
      vdrAdd2: [],
      vdrCity: [],
      vdrState: [],
      vdrCountry: [],
      vdrPincode: [],
      vdrContactPersonName: [],
      vdrContactPersonPhone: [],
      vdrEmail: [],
    });
  }
  submitVendorDetails(data: any) {
    console.log(data);
    this.vendorService.addVendor(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
        if (error.status == 200) {
          alert(error.error.text);
        }
      },
    );
  }
}
