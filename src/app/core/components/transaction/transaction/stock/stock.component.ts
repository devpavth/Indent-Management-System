import { Component, inject, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { ProductService } from '../../../service/Product/product.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { VendorService } from '../../../service/vendor/vendor.service';
import { catchError, debounceTime, filter, of, switchMap } from 'rxjs';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { RequestService } from '../../../service/Request/request.service';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  _branch: any;
  inwardFormHeader: FormGroup;
  inwardForm: FormGroup;

  route = inject(Router);

  private employeeService = inject(EmployeeServiceService);
  reqService = inject(RequestService);

  isBox: boolean = false;
  gstPercentages: number[] = [0, 5, 12, 18, 28];
  units: { id: number; name: string; term: string }[] = [
    { id: 1, name: 'Kg', term: 'Kilograms' },
    { id: 2, name: 'L', term: 'Liters' },
    { id: 3, name: 'M', term: 'Meter' },
    { id: 4, name: 'Unit', term: 'Piece' },
    { id: 5, name: 'Lt', term: 'Liters' },
    { id: 6, name: 'Feet', term: 'Feet' },
    { id: 7, name: 'Roll', term: 'Roll' },
    { id: 8, name: 'Dcm', term: 'Decimeters' },
    { id: 9, name: 'Bag', term: 'Bag' },
    { id: 10, name: 'Pair', term: 'Pair' },
    { id: 11, name: 'Tin', term: 'Tin' },
    { id: 12, name: 'Sheet', term: 'Sheet' },
    { id: 13, name: 'Ream', term: 'Ream' },
    { id: 14, name: 'No', term: 'Number' },
    { id: 15, name: 'Meter', term: 'Meter' },
    { id: 200, name: 'Box', term: 'Box' },
  ];
  productData: any;

  productList: any[] = [];

  vendorList: any;

  header: any;

  headerView: any;

  totalItem: number = 0;

  isSuccess: boolean = false;
  transactionID: object = {};

  isProductSelected: boolean = false;
  noResults: boolean = false;
  storeProductData: Product[] = [];

  isVendorSelected: boolean = false;
  noVendor: boolean = false;
  vendorSearchList: any[] = [];

  selectedVendorId: any;

  filteredBranch: any;
  filteredToBranch: any;

  vendorData: any;
  isErrorToast: boolean = false;
  errorToastMsg: string = '';
  selectedBranchId: number = 0;
  prdClosingStock: number = 0;

  user: any;
  userData: any;
  roles: string | null = null;
  isLevelView: boolean = true;
  isAddTransactionView: boolean = false;
  isProductIdDisabled: boolean = true;
  isViewTransaction: boolean = false;
  confirmTransactionMsg: string = '';
  RefIndentLabel: string = 'Reference No:';
  isIndentConfirmed!: boolean;
  isViewHeadOfAccSelectField: boolean = false;
  indentHeadOfAccDetails: any[] = [];
  selectedHeadOfAccId: number = 0;
  selectVendorName: string = '';
  selectVendorId: number = 0;
  isManualVendorSelection: boolean = false;

  constructor(
    private branchService: BranchService,
    private productService: ProductService,
    private fb: FormBuilder,
    private shared: SharedServiceService,
    private vendorService: VendorService,
  ) {
    this.inwardFormHeader = this.fb.group({
      tranRefNo: [''],
      inwardFromCode: [''],
      branchId: [''],
      vendorId: [''],
    });
    this.inwardForm = this.fb.group({
      productId: [],
      prdUnit: [],
      prdQty: ['', [Validators.required, this.quantityValidator.bind(this)]],
      purchasedPrice: [],
      gstPercentage: [],
    });
    if (this.isBox) {
      this.inwardForm.addControl(
        'totalPieces',
        this.fb.control(null, Validators.required),
      );
    }
    this.inwardForm.get('prdUnit')?.disable();
  }
  ngOnInit() {
    this.inwardForm
      .get('productId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          console.log(`Product Name Changed for Index:`, searchTerm);
          if (this.isProductSelected) {
            this.isProductSelected = false;
            this.inwardForm.get('prdQty')?.clearValidators();
            this.inwardForm.get('prdQty')?.updateValueAndValidity();
            return of([]);
          }
          this.noResults = false;
          this.storeProductData = [];
          if (!searchTerm?.trim() || !isNaN(searchTerm)) {
            this.inwardForm.get('prdQty')?.clearValidators();
            this.inwardForm.get('prdQty')?.updateValueAndValidity();
            return of([]);
          }

          let httpParams = new HttpParams().set('searchTerm', searchTerm);

          if (this.inwardFormHeader.get('inwardFromCode')?.value == 268) {
            httpParams = httpParams.append(
              'branchId',
              this.selectedBranchId.toString(),
            );
          }

          console.log('API Params:', httpParams.toString());

          return this.productService.fetchLiveProductDetails(httpParams).pipe(
            catchError((error) => {
              if (error.status === 404) {
                console.log('error while fetching product data:', error);
                this.noResults = true;
              }
              return of([]);
            }),
          );
        }),
      )
      .subscribe((response: Product[]) => {
        this.storeProductData = response;
        console.log('fetching product data from backend:', response);

        // if (this.inwardForm.get('prdUnit')?.value == 200) {
        //   this.isBox = true;
        //   this.updateForm();
        // }

        this.isProductSelected = false;
      });

    this.inwardFormHeader
      .get('inwardFromCode')
      ?.valueChanges.subscribe((optionValue) => {
        this.inwardFormHeader.get('vendorId')?.setValue(null);
        if (optionValue === '269') {
          this.setupVendorSearch();
        } else if (optionValue === '268') {
          // this.inwardFormHeader.get('vendorId')?.setValue(null);
          this.fetchAllBranch();
        }
      });

    this.user = sessionStorage.getItem('userId');
    this.roles = sessionStorage.getItem('roles');
    console.log('this.roles in stock:', this.roles);

    if (!this.roles?.includes('ROLE_ADD_PRD_TRANS')) {
      this.isLevelView = false;
    }

    if (this.user) {
      this.employeeService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log('this.userData:', this.userData);
        console.log(
          'this.userData with empRole:',
          typeof this.userData.empRole,
        );
      });
    }

    this.fetchAllBranch();
    this.isViewTransaction = true;
    this.confirmTransactionMsg =
      'Do you want to add a Transaction based on Indent';

    console.log('tranRefNo Control:', this.inwardFormHeader.get('tranRefNo'));

    this.inwardFormHeader
      .get('tranRefNo')
      ?.valueChanges.pipe(
        debounceTime(500),
        filter((value) => {
          console.log('User input detected:', value);
          console.log('isIndentConfirmed:', this.isIndentConfirmed);
          return this.isIndentConfirmed && value.trim() !== '';
        }),
      )
      .subscribe((value) => {
        console.log('API should be triggered with:', value);
        this.fetchHeadOfAccByIndent(value);
      });

    this.inwardFormHeader.get('inwardFromCode')?.valueChanges.subscribe(() => {
      this.inwardForm.get('prdQty')?.updateValueAndValidity();
    });
    // this.fetchVendorList();
  }

  setupVendorSearch() {
    this.inwardFormHeader
      .get('vendorId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          if (this.isVendorSelected) {
            return of([]);
          }
          this.noVendor = false;
          if (!searchTerm || searchTerm.length < 3) {
            this.vendorSearchList = [];
            return of([]);
          }
          return this.productService
            .fetchLiveVendorDetails({ searchTerm })
            .pipe(
              catchError((error) => {
                if (error.status === 404) {
                  console.log('Vendor API Error:', error);
                  this.noVendor = true;
                }
                return of([]);
              }),
            );
        }),
      )
      .subscribe((response: any) => {
        console.log('fetching vendor data from backend:', response);

        this.vendorSearchList = response;
        this.isVendorSelected = false;
      });
  }

  fetchHeadOfAccByIndent(indentNo: string) {
    console.log('Calling API with:', indentNo);
    this.reqService.fetchHeadOfAccByIndent(indentNo).subscribe(
      (res: any) => {
        console.log('fetching head of acc using indent:', res);
        this.isViewHeadOfAccSelectField = true;
        this.indentHeadOfAccDetails = res;
      },
      (error) => {
        console.log('error while fetching head of acc:', error);
        this.isErrorToast = true;
        this.errorToastMsg = error.error.errorMessege;
        setTimeout(() => {
          this.isErrorToast = false;
        }, 3000);
      },
    );
  }

  selectedHeadOfacc(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedHeadOfAccId = Number(selectElement.value);

    console.log('this.selectedHeadOfAccId:', this.selectedHeadOfAccId);

    const selectHeadOfAcc = this.indentHeadOfAccDetails.find(
      (head) => head.headOfAccId === this.selectedHeadOfAccId,
    );

    if (selectHeadOfAcc) {
      this.selectVendorName = selectHeadOfAcc.assgndVendorData.vendorName;
      this.selectVendorId = selectHeadOfAcc.assgndVendorData.vendorId;

      this.vendorData = [selectHeadOfAcc.assgndVendorData];

      console.log('this.vendorData in headofacc:', this.vendorData);

      this.productList = selectHeadOfAcc.productDetailsDTOs.map(
        (item: any) => ({
          ...item,
          purchasedPrice: item.unitPrice,
          prdQty: item.qty,
          gstPercentage: item.prdGstPct,
          total: { itemPrice: item.itemTotalPrice },
        }),
      );

      console.log('this.productList in headOfAcc:', this.productList);

      console.log('Selected Vendor Name:', this.selectVendorName);

      this.isManualVendorSelection = true;

      this.inwardFormHeader.get('vendorId')?.setValue(this.selectVendorName);

      this.vendorSearchList = [];

      console.log(
        'condition:',
        this.inwardFormHeader.get('inwardFromCode')?.value === 269,
      );

      console.log('After patchValue:', this.inwardFormHeader.value);
    }
  }

  fetchAllBranch() {
    this.branchService.getBranch().subscribe((res) => {
      console.log('fetching branch details:', res);

      this._branch = res;

      this.filteredBranch = this._branch.slice(0, 1);

      console.log('filteredBranch:', this.filteredBranch);

      if (
        this._branch &&
        Array.isArray(this._branch) &&
        this.userData?.empDesig === 15
      ) {
        this._branch = this._branch.filter(
          (branch) => branch.branchName !== this.filteredBranch[0].branchName,
        );
        console.log(
          "Filtered Branches (excluding 'Head Office'):",
          this.filteredToBranch,
        );
      }

      // if(this._branch[0]?.branchName === "Head Office"){
      //   this.filteredToBranch = this._branch.slice(1);
      // }
    });
  }

  selectedBranch(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log('selectElement:', selectElement);

    const selectedValue = selectElement.value;
    console.log('selectedValue:', selectedValue);

    if (!selectedValue || isNaN(Number(selectedValue))) {
      console.warn('Invalid branch selection. Setting to default.');
      this.selectedBranchId = 0; // Or handle appropriately
      return;
    }

    this.selectedBranchId = Number(selectedValue);
    console.log('this.selectedBranchId:', this.selectedBranchId);
  }

  onSelectProduct(product: Product) {
    console.log('after selecting the product from the list', product);
    this.isProductSelected = true;

    this.productData = [product];
    console.log('productData:', this.productData);
    console.log('product data prdQty:', this.productData[0].prdMinQty);

    this.prdClosingStock = this.productData[0].prdClosingStock;
    console.log('this.prdClosingStock:', this.prdClosingStock);
    this.inwardForm.patchValue({
      // productId: product.productId,
      prdUnit: product.prdUnit,

      // prdQty: product.prdMinQty,
      purchasedPrice: product.prdPurchasedPrice,
      gstPercentage: product.prdGstPct,
    });

    // this.inwardForm.

    if (this.inwardForm.get('prdUnit')?.value == 200) {
      this.isBox = true;
      this.updateForm();
    }

    console.log(
      'Form values updated with selected product data:',
      this.inwardForm.value,
    );

    this.storeProductData = [];
  }

  quantityValidator(control: AbstractControl) {
    const inwardFromCode = this.inwardFormHeader.get('inwardFromCode')?.value;

    // For debug
    // console.log('inwardFromCode:', inwardFromCode);
    // console.log('inwardFromCode:', typeof inwardFromCode);

    if (
      control.value &&
      inwardFromCode === '268' &&
      control.value > this.prdClosingStock
    ) {
      return { quantityExceeded: true };
    }
    return null;
  }

  onSelectVendor(vendor: any) {
    console.log('after selecting the product from the list', vendor);
    this.isVendorSelected = true;
    this.inwardFormHeader.get('vendorId')?.setValue(vendor.vendorName);

    console.log('logging vendorId');
    this.selectedVendorId = vendor.vendorId;
    this.vendorData = [vendor];

    console.log('vendorData:', this.vendorData);
    this.vendorSearchList = [];
  }

  ifBox(data: any) {
    console.log(data);
    this.isBox = data == 200;

    this.updateForm();
  }

  updateForm() {
    if (this.isBox && !this.inwardForm.contains('totalPieces')) {
      console.log("Adding 'totalPieces' control to the form");
      this.inwardForm.addControl(
        'totalPieces',
        this.fb.control(null, Validators.required),
      );
    } else if (!this.isBox && this.inwardForm.contains('totalPieces')) {
      this.inwardForm.removeControl('totalPieces');
    }
  }

  calculateBoxItem() {
    if(this.isBox){
      this.totalItem =
        this.inwardForm.get('totalPieces')?.value /
        this.inwardForm.get('prdQty')?.value;

      console.log('prdQty:', this.inwardForm.get('prdQty')?.value);
      console.log('prdUnit:', this.inwardForm.get('totalPieces')?.value);
      console.log('this.totalItem:', this.totalItem);
      this.inwardForm.patchValue({ purchasedPrice: this.totalItem });
      console.log('inward form:', this.inwardForm.value);
    }   
    this.updateForm();
  }

  addProductList(data: any) {
    console.log(data);

    const existingProductIndex = this.productList.findIndex(
      (product) => product.productId === data.productId,
    );
    if (existingProductIndex !== -1) {
      // Product exists, update the quantity and total
      let existingProduct = this.productList[existingProductIndex];
      existingProduct.prdQty += data.prdQty; // Update quantity
      existingProduct.total = this.shared.gstCalculation(
        existingProduct.prdQty,
        existingProduct.purchasedPrice,
        existingProduct.gstPercentage,
      ); // Recalculate total

      // Update the product in the productList array
      this.productList[existingProductIndex] = existingProduct;
    } else {
      let total = this.shared.gstCalculation(
        data.prdQty,
        data.purchasedPrice,
        data.gstPercentage,
      );
      this.productList.push({
        ...data,
        prdUnit: this.productData[0].prdUnit,
        total,
        prdCode: this.productData[0].prdCode,
        productId: this.productData[0].productId,
      });
      console.log(total);
    }

    console.log('this.productList:', this.productList);

    this.inwardForm.reset();
    this.productData = '';
    this.isBox = false;
  }

  inwardHeader(data: any) {
    console.log('inwardHeader add header btn:', data);

    this.header = data;

    if (this.inwardFormHeader.get('inwardFromCode')?.value === '269') {
      this.header.vendorId = this.selectedVendorId;
    }

    if (this.isIndentConfirmed) {
      if (this.inwardFormHeader.get('inwardFromCode')?.value === '269') {
        this.header.vendorId = this.selectVendorId;
        // data.vendorId = this.selectVendorId;
      }
    }

    let branch: any[] = this._branch;
    let vendor: any[] = this.vendorData;

    console.log('vendor:', vendor);

    let branchDetails = branch.find((f) => f.branchId == data.vendorId);
    console.log('branchDetails:', branchDetails);
    let vendorDetails = vendor?.find((v) => v.vendorId == data.vendorId);
    console.log('vendorDetails:', vendorDetails);
    let branchDetails1 = branch.find((f) => f.branchId == data.branchId);
    console.log('branchDetails1:', branchDetails1);
    if (branchDetails1) {
      this.header.branchName = branchDetails1.branchName;
    }
    if (this.inwardFormHeader.get('inwardFromCode')?.value == 269) {
      if (vendorDetails) {
        this.header.vendorName = vendorDetails.vendorName;
      }
    } else if (this.inwardFormHeader.get('inwardFromCode')?.value == 268) {
      if (branchDetails) {
        this.header.vendorName = branchDetails.branchName;
      }
    }

    this.isProductIdDisabled = false;

    console.log('this.header:', this.header);
  }

  deleteHeader() {
    this.header = '';
    console.log('while deleting the header:', this.header);
    // this.inwardFormHeader.get('vendorId')?.setValue(null);
    this.inwardFormHeader.reset();
  }

  closeSuccess(data: boolean) {
    this.isSuccess = data;
    this.resetComponent();
    this.route.navigate(['/home/pTransaction']);
  }

  deleteItem(product: any) {
    this.productList = this.productList.filter(
      (p) => p.productId !== product.productId,
    );
  }

  confirmIndentTrans() {
    this.RefIndentLabel = 'Indent No';
    this.isIndentConfirmed = true;
    console.log('Indent confirmed! Now API should trigger when user types.');
  }

  onSubmit() {
    const inwardFromCode = this.inwardFormHeader.get('inwardFromCode')?.value;

    let finalList = { ...this.header, transPrdDetails: this.productList };
    console.log('finalList:', finalList);

    if (inwardFromCode === '269') {
      console.log('checking inward transaction');
      this.productService.addInward(finalList).subscribe(
        (res: any) => {
          console.log('successfully submitting inward data:', res);

          this.isSuccess = true;
          let successData = { show: 2, text: res.error };
          this.transactionID = successData;
        },
        (error) => {
          console.log('error while saving inward data:', error);
          // if (error.status == 200) {

          //   this.isSuccess = true;
          //   let successData = { show: 2, text: error.error.text };
          //   this.transactionID = successData;
          // }
          // console.log(error.error.text);
        },
      );
    } else if (inwardFromCode === '268') {
      console.log('checking outward transaction');
      this.productService.saveOutward(finalList).subscribe(
        (res: any) => {
          console.log('successfully submitting outward data:', res);
          console.log('successfully submitting outward data:', res.error);
          this.isSuccess = true;
          let successData = { show: 2, text: res.error };
          this.transactionID = successData;
        },
        (error) => {
          console.log('error while saving outward data:', error);

          this.isErrorToast = true;
          this.errorToastMsg = error.error.error;
          setTimeout(() => {
            this.isErrorToast = false;
          }, 3000);
          // if (error.status == 200) {

          //   this.isSuccess = true;
          //   let successData = { show: 2, text: error.error.text };
          //   this.transactionID = successData;
          // }
          // console.log(error.error.text);
        },
      );
    } else {
      console.log('Error: Invalid inwardFromCode value');
    }
  }
  resetComponent() {
    this.inwardFormHeader.reset();
    this.inwardForm.reset();
    this.isBox = false;
    this.header = null;
    this.productData = null;
    this.productList = [];
    this.totalItem = 0;
    this.transactionID = {};

    // Fetch initial data if necessary
    this.fetchAllBranch();
    // this.fetchVendorList();
  }

  closePopUp(closeIcon: boolean) {
    this.isViewTransaction = closeIcon;
  }
}
