import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.css',
})
export class AddVendorComponent {
  isChecked: boolean = false;
  addVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private route: Router,
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
      vdrGstNo: [],
      vdrPanNo: [],
      vdrTanNo: [],
      vdrMsmeNo: [],
      estDate: [],
      serviceLocation: [],
      bizType: [],
      bizDetailName: [],
      bizDetails: [],
      ifsCode: [],
      bankAccNo: [],
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
          this.route.navigate(['/home/vendorList']);
        }
      },
    );
  }
}
