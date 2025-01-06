import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Router } from '@angular/router';
import { BranchService } from '../../../service/Branch/branch.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrl: './view-vendor.component.css',
})
export class ViewVendorComponent {
  isChecked: boolean = false;
  @Output() closeVendor = new EventEmitter<boolean>();
  @Input() vendorData: any;
  isSave = false;
  isEdit = true;
  isSaveIcon = true;
  deleteVendor: any;
  isDelete: boolean = false;
  _BranchName: any;
  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: any[] = [];
  cityDropDownOptions: any;

  private sharedService = inject(SharedServiceService);

  UpdateVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private branchService: BranchService,
    private route: Router,
  ) {
    this.UpdateVendorForm = this.fb.group({
      branchId: [],
      vendorId: [],
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
    this.UpdateVendorForm.patchValue(this.vendorData);
    console.log("this.vendorData:", this.vendorData);
    console.log("this.vendorData:", this.vendorData.vdrCity);
    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      this.UpdateVendorForm.get(form)?.disable();
    });


    // this.UpdateVendorForm.patchValue({
    //   vdrCity: this.vendorData.vdrCity
    // })

    this.UpdateVendorForm.get('vdrPincode')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((pincode) => {
        if(this.isPincodeSelected){
          return of([]);
        }
        this.noPincode = false;
        if(!pincode || pincode.toString().length !==6){
          this.pincodeList = [];
          return of([]);
        }
        return this.sharedService.fetchPincode(pincode).pipe(
          catchError((error)=>{
            if(error.status === "Error"){
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
          && this.pincodeList.length === 0
        ){
          console.log("Pincode API Error:", response?.[0]?.status);
          this.noPincode = true;

          this.UpdateVendorForm.patchValue({
            vdrCity: '',
            vdrState: '',
            vdrCountry: ''
          },{emitEvent: false})
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

          this.cityDropDownOptions = cityDropDownOptions;

          this.UpdateVendorForm.patchValue({
            vdrCity: cityDropDownOptions[0].value,
            vdrState: this.pincodeList[0].state,
            vdrCountry: this.pincodeList[0].country
          },
        {emitEvent: false}
      )
        
        }
        this.isPincodeSelected = false;
      }
    )
  }

  get vendorAcccountDetails() {
    return this.UpdateVendorForm.get('vendorAcccountDetails') as FormArray;
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
  edit() {
    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      this.UpdateVendorForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }
  updateVendorDetails(data: any) {
    console.log(data);
    let id = this.UpdateVendorForm.get('vendorId')?.value;
    console.log(id);

    this.vendorService.updateVendor(id, data).subscribe(
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
  getBranchName() {
    this.branchService.getBranch().subscribe((res) => {
      console.log(res);
      this._BranchName = res;
      console.log(this._BranchName);
    });
  }

  toggledelete(check: any, isView: boolean) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteVendor = {
        title: 'Vendor',
        action: 3,
        deleteId: this.vendorData.vendorId,
      };
    } else if (check == 0) {
      this.isDelete = isView;
      this.closeVendor.emit(false);
    }
  }
}
