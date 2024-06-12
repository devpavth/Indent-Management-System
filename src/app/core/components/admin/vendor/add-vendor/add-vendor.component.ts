import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
>>>>>>> 2b1d7429cbe2d4e0915b594db79d9708a0631ebf

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
<<<<<<< HEAD
    private route: Router,
=======
>>>>>>> 2b1d7429cbe2d4e0915b594db79d9708a0631ebf
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
<<<<<<< HEAD
          this.route.navigate(['/home/vendorList']);
=======
          alert(error.error.text);
>>>>>>> 2b1d7429cbe2d4e0915b594db79d9708a0631ebf
        }
      },
    );
  }
}
