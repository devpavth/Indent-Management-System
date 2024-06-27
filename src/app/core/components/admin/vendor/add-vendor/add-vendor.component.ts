import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Router } from '@angular/router';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.css',
})
export class AddVendorComponent implements OnInit {
  isChecked: boolean = false;
  _BranchName: any;
  addVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private route: Router,
  ) {
    this.addVendorForm = this.fb.group({
      branchId: [],
      vendorName: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      vdrAdd1: ['', Validators.required],
      vdrAdd2: ['', Validators.required],
      vdrCity: ['', Validators.required],
      vdrState: ['', Validators.required],
      vdrCountry: ['', Validators.required],
      vdrPincode: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)],
      ],
      vdrContactPersonName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      vdrContactPersonPhone: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{9}$/)],
      ],
      vdrEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-z]+.([a-z]{2})+(?:\.(com|in|edu|net)){1}$/,
          ),
        ],
      ],
      vdrGstNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z\d]{2}$/),
        ],
      ],
      vdrPanNo: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      ],
      vdrTanNo: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]$/)],
      ],
      vdrMsmeNo: [],
      estDate: ['', Validators.required],
      serviceLocation: ['', Validators.required],
      bizType: ['', Validators.required],
      bizDetailName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      bizDetails: ['', Validators.required],
      vendorAcccountDetails: this.fb.array([this.showBankData()]),
    });
  }
  ngOnInit(): void {
    this.getBranchName();
  }

  get vendorAcccountDetails() {
    return this.addVendorForm.get('vendorAcccountDetails') as FormArray;
  }

  showBankData() {
    return this.fb.group({
      ifsCode: ['', Validators.required],
      bankAccNo: ['', Validators.required],
    });
  }

  addbank() {
    this.vendorAcccountDetails.push(this.showBankData());
  }

  getBranchName() {
    this.vendorService.getBranch().subscribe((res) => {
      console.log(res);
      this._BranchName = res;
      console.log(this._BranchName);
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
