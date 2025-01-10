import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, switchMap, of, catchError } from 'rxjs';
import { BranchService } from '../../../service/Branch/branch.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { VendorService } from '../../../service/vendor/vendor.service';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css'
})
export class ViewTransactionComponent {
  isChecked: boolean = false;
  @Output() closeVendor = new EventEmitter<boolean>();
  @Input() transactionData: any;
  isSave = true;
  // isEdit = true;
  isSaveIcon = true;
  deleteVendor: any;
  isDelete: boolean = false;
  _BranchName: any;
  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: any[] = [];
  cityDropDownOptions: any;

  transactionList: any;
  inwardPrdDetails: any;

  private productService = inject(ProductService);

  private sharedService = inject(SharedServiceService);

  TransactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private branchService: BranchService,
    private route: Router,
  ) {
    this.TransactionForm = this.fb.group({
      prdtrnsCode: [],
      inwardFromCode: [],
      tranRefNo: [],
      totalPrice: [],
      tranUpdBy: [],
      tranUpdOn: [],
      
      // branchDto: this.fb.group({
      //   branchName: [],
      //   add1: [],
      //   add2: [],
      //   city: [],
      //   state: [],
      //   pinCode: [],
      //   gstNumber: [],
      //   manager: [],
      //   branchMobilenumber: []
      // }),
      // vendorDto: this.fb.group({
      //   branchName: [],
      //   add1: [],
      //   add2: [],
      //   city: [],
      //   state: [],
      //   pinCode: [],
      //   gstNumber: [],
      //   manager: [],
      //   branchMobilenumber: []
      // }),
      // transPrdDetails: this.fb.array([this.showTransactionDetails()]),
    });
  }

  // showTransactionDetails(){
  //   return this.fb.group({
  //     transProductData: this.fb.group({
  //       prdmdlName: [],
  //       prdDescription: [],
  //       prdCode: [],
  //       prdHsnCode: [],
  //       prdbrndName: [],
  //       prdgrpName: [],
  //       prdcatgName: [],
  //       headOfAccName: []
  //     }),
  //     prdUnit: [],
  //     totalPieces: [],
  //     prdQty: [],
  //     purchasedPrice: [],
  //     gstPercentage: [],
  //     itemTotalPrice: [],
  //     updatedBy: [],
  //     updateOn: [],
  //   })
  // }

  ngOnInit(): void {
    // this.getBranchName();
    this.TransactionForm.patchValue(this.transactionData);  
    console.log("this.transactionData:", this.transactionData);
    Object.keys(this.TransactionForm.controls).forEach((form) => {
      this.TransactionForm.get(form)?.disable();
    });

    this.productService.productTransaction(this.transactionData.prdtrnsCode).subscribe(
      (res) =>{
        console.log("fetching transaction details:", res);
        this.transactionList = res;

        this.inwardPrdDetails = this.transactionList.transPrdDetails;
      },
      (error) => {
        console.log("error while fetching transaction details:", error);
      }
    )

  }

  get transactionDetails() {
    return this.TransactionForm.get('transPrdDetails') as FormArray;
  }

  edit() {
    Object.keys(this.TransactionForm.controls).forEach((form) => {
      this.TransactionForm.get(form)?.enable();
    });
    this.isSave = true;
    // this.isEdit = false;
  }

  acceptTransactionDetails(code: any){
    this.productService.confirmInward(code).subscribe(
      (res) => {
        console.log("accepting inward alert transaction:", res);
        this.closeVendor.emit(false);
      },
      (error) => {
        console.log("error while accepting inward alert transaction:", error);
      }
    )
  }

  // getBranchName() {
  //   this.branchService.getBranch().subscribe((res) => {
  //     console.log(res);
  //     this._BranchName = res;
  //     console.log(this._BranchName);
  //   });
  // }


}
