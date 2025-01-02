import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Router } from '@angular/router';
import { BranchService } from '../../../service/Branch/branch.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.css',
})
export class AddVendorComponent implements OnInit {
  isChecked: boolean = false;
  _BranchName: any;
  addVendorForm: FormGroup;

  private sharedService = inject(SharedServiceService);
  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: any[] = [];
  cityDropDownOptions: any;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private branchService: BranchService,
    private route: Router,
  ) {
    this.addVendorForm = this.fb.group({
      branchId: [],
      vendorName: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      vdrAdd1: ['', Validators.required, 
        Validators.minLength(20),
        Validators.maxLength(150)],
      vdrAdd2: ['', Validators.required, 
        Validators.minLength(20), 
        Validators.maxLength(100)],
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
        // [Validators.required, Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]$/)],
      ],
      vdrMsmeNo: [],
      estDate: [''],
      serviceLocation: ['', Validators.required],
      bizType: [''],
      bizDetailName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      bizDetails: ['', Validators.required],
      vendorAcccountDetails: this.fb.array([this.showBankData()]),
    });
  }
  ngOnInit(): void {

    this.addVendorForm.get('vdrPincode')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((pincode) => {
        if(this.isPincodeSelected){
          return of([]);
        }
        this.noPincode = false;
        if(!pincode || pincode.toString().length !== 6){
          this.pincodeList = [];
          return of([]);
        }
        return this.sharedService.fetchPincode(pincode).pipe(
          catchError((error) => {
            if(error[0].status === "Error"){
              console.log("Pincode API Error:", error);
              this.noPincode = true;
            }
            return of([]);
          })
        )
      })
    )
    .subscribe(
      (response: any) => {
        const postOfficeArray = response?.[0]?.postOffice ?? [];
        console.log("postOfficeArray:", postOfficeArray);

        this.pincodeList = postOfficeArray;
        console.log("reponse from pincode:", response);
        console.log("typeof Pincode API Error:", typeof response?.[0]?.status);

        if(response?.[0]?.status === "Error" 
            && this.pincodeList.length === 0){
          console.log("Pincode API Error:", response?.[0]?.status);
          this.noPincode = true;
          
          this.addVendorForm.patchValue({
            vdrCity: '',
            vdrState: '',
            vdrCountry: ''
          },
          {emitEvent: false}
        )
        }
        console.log("fetching pincode with live search:", this.pincodeList);

        if(this.pincodeList.length > 0){
          const cityDropDownOptions = this.pincodeList.map(
            (address) => ({
              label: `${address.name}, ${address.city}`,
              value: `${address.name}, ${address.city}`
            })
          )

          console.log("cityDropDownOptions:", cityDropDownOptions);

          this.addVendorForm.patchValue({
            vdrCity: cityDropDownOptions[0].value,
            vdrState: this.pincodeList[0].state,
            vdrCountry: this.pincodeList[0].country
          },
          {emitEvent: false}
        )

        this.cityDropDownOptions = cityDropDownOptions;
        }
        this.isPincodeSelected = false;
      }
    )

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
    this.branchService.getBranch().subscribe((res) => {
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
