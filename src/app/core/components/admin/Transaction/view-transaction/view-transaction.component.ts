import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, switchMap, of, catchError } from 'rxjs';
import { BranchService } from '../../../service/Branch/branch.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { VendorService } from '../../../service/vendor/vendor.service';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css'
})
export class ViewTransactionComponent {
  isChecked: boolean = false;
  @Output() closeVendor = new EventEmitter<boolean>();
  @Input() transactionData: any;
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

  TransactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private branchService: BranchService,
    private route: Router,
  ) {
    this.TransactionForm = this.fb.group({
      prdtransId: [],
      prdtrnsCode: [],
      transType: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      tranRefNo: ['', Validators.required],
      totalPrice: ['', Validators.required],
      tranUpdBy: ['', Validators.required],
      tranUpdOn: ['', Validators.required],
      prdUnit: ['', Validators.required],
      totalPieces: [
        '',
        [Validators.required],
      ],
      prdQty: [
        '',
        [Validators.required],
      ],
      purchasedPrice: [
        '',
        [Validators.required],
      ],
      gstPercentage: [
        '',
        [
          Validators.required
        ],
      ],
      itemTotalPrice: [
        '',
        [
          Validators.required
        ],
      ],
      updatedBy: [
        '',
        [Validators.required],
      ],
      updateOn: [
        '',
        [Validators.required],
      ],
      branchDto: this.fb.group({
        branchName: [],
        branchCode: [],
        add1: [],
        add2: [],
        city: [],
        state: [],
        pinCode: [],
        gstNumber: [],
        manager: [],
        branchMobilenumber: []
      }),
      vendorDto: this.fb.group({

      }),
      transPrdDetails: this.fb.array([this.showTransactionDetails()]),
    });
  }

  showTransactionDetails(){
    return this.fb.group({
      prdmdlName: [],
      prdDescription: [],
      prdCode: [],
      prdHsnCode: [],
      prdPurchasedPrice: [],
      prdUnit: [],
      prdGstPct: [],
      prdMinQty: [],
      prdClosingStock: [],
      prdTotalValue: [],
      createdBy: [],
      createdOn: [],
      prdbrndName: [],
      prdgrpName: [],
      prdcatgName: [],
      headOfAccName: []
    })
  }

  ngOnInit(): void {
    this.getBranchName();
    this.TransactionForm.patchValue(this.transactionData);
    console.log("this.vendorData:", this.transactionData);
    console.log("this.vendorData:", this.transactionData.vdrCity);
    Object.keys(this.TransactionForm.controls).forEach((form) => {
      this.TransactionForm.get(form)?.disable();
    });


    // this.UpdateVendorForm.patchValue({
    //   vdrCity: this.vendorData.vdrCity
    // })

    this.TransactionForm.get('vdrPincode')?.valueChanges
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

          this.TransactionForm.patchValue({
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

          this.TransactionForm.patchValue({
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
    return this.TransactionForm.get('vendorAcccountDetails') as FormArray;
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
    Object.keys(this.TransactionForm.controls).forEach((form) => {
      this.TransactionForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }
  updateVendorDetails(data: any) {
    console.log(data);
    let id = this.TransactionForm.get('vendorId')?.value;
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


}
