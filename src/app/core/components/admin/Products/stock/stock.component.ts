import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { ProductService } from '../../../service/Product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Logger } from 'html2canvas/dist/types/core/logger';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  _branch: any;
  inwardFormHeader: FormGroup;
  inwardForm: FormGroup;

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
  storeProductData: any[] = [];

  isVendorSelected: boolean = false;
  noVendor: boolean = false;
  vendorSearchList: any[] = [];

  selectedVendorId: any;



  vendorData: any;

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
      itemprebox: [],
      prdQty: [],
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
    this.inwardForm.get('productId')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((searchTerm) => {
        console.log(`Product Name Changed for Index:`, searchTerm);
        if(this.isProductSelected){
          this.isProductSelected = false;
          return of([]);
        }
        this.noResults = false;
        this.storeProductData = [];
        if(!searchTerm?.trim() || !isNaN(searchTerm)){
          return of([]);
        }
        return this.productService.fetchLiveProductDetails({searchTerm}).pipe(
          catchError((error) => {
            if(error.status === 404){
              console.log("error while fetching product data:", error);
              this.noResults = true;
            }
            return of([]);
          })
        )
      })
    ).subscribe(
      (response: any) => {
        this.storeProductData = response;
        console.log("fetching product data from backend:", response);

        
        // if (this.inwardForm.get('prdUnit')?.value == 200) {
        //   this.isBox = true;
        //   this.updateForm();
        // }

        this.isProductSelected = false;

      }
    )

    this.inwardFormHeader.get('inwardFromCode')?.valueChanges.subscribe(
      (optionValue) => {
        this.inwardFormHeader.get('vendorId')?.setValue(null);
        if(optionValue === '269'){
          this.setupVendorSearch();
        }
        else if(optionValue === '268'){
          // this.inwardFormHeader.get('vendorId')?.setValue(null);
          this.fetchAllBranch();
        }
      }
    )

    

    // const inwardFromCodeValue = Number(this.inwardFormHeader.get('inwardFromCode')?.value);

    // // Debugging to ensure correct value and type
    // console.log("Value of inwardFromCode:", inwardFromCodeValue);
    // console.log("Type of inwardFromCode:", typeof inwardFromCodeValue);

    // if (inwardFromCodeValue === 268) {
    //   console.log("Branch selected: inwardFromCode =", inwardFromCodeValue);
    //   this.fetchAllBranch(); // Call branch API
    // } else if (inwardFromCodeValue === 269) {
    //   console.log("Vendor selected: inwardFromCode =", inwardFromCodeValue);
    //   this.fetchVendorList(); // Call vendor API
    // } else {
    //   console.log("No matching condition for inwardFromCode:", inwardFromCodeValue);
    // }

    this.fetchAllBranch();
    // this.fetchVendorList();
  }

  setupVendorSearch(){
    this.inwardFormHeader.get('vendorId')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((searchTerm) =>{
        if(this.isVendorSelected){
          return of([]);
        }
        this.noVendor = false;
        if(!searchTerm || searchTerm.length < 3){
          this.vendorSearchList = [];
          return of([]);
        }
        return this.productService.fetchLiveVendorDetails({searchTerm}).pipe(
          catchError((error) => {
            if(error.status === 404){
              console.log("Vendor API Error:", error);
              this.noVendor = true;
            }
            return of([]);
          })
        )
      })
    )
    .subscribe(
      (response: any) => {
        console.log("fetching vendor data from backend:", response);

        this.vendorSearchList = response;
        this.isVendorSelected = false;
      }
    )
  }

  fetchAllBranch() {
    this.branchService.getBranch().subscribe((res) => {
      console.log("fetching branch details:", res);

      this._branch = res;
    });
  }

  onSelectProduct(product: any){
    console.log("after selecting the product from the list", product);
    this.isProductSelected = true;
    
    this.productData = [product];
    console.log("productData:", this.productData);
    console.log("product data prdQty:", this.productData[0].prdMinQty);

    // 

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

    console.log("Form values updated with selected product data:", this.inwardForm.value);


    this.storeProductData = [];
  }

  onSelectVendor(vendor: any){
    console.log("after selecting the product from the list", vendor);
    this.isVendorSelected = true;
    this.inwardFormHeader.get('vendorId')?.setValue(vendor.vendorName);

    console.log("logging vendorId");
    this.selectedVendorId = vendor.vendorId;
    this.vendorData = [vendor];
  
    
    console.log("vendorData:", this.vendorData);
    this.vendorSearchList = [];
  }

  // fetchProductData(data: string) {
  //   this.productService.getProductByCode(data).subscribe((res) => {
  //     console.log(res);
  //     this.productData = res;
  //     this.inwardForm.patchValue({
  //       productId: this.productData.productId,
  //       prdUnit: this.productData.prdUnit,

  //       prdQty: this.productData.prouctId,
  //       purchasedPrice: this.productData.prdPurchasedPrice,
  //       gstPercentage: this.productData.prdGstPct,
  //     });
      
      
  //   });
  // }
  // fetchVendorList() {
  //   this.vendorService.getVendorName().subscribe((res) => {
  //     console.log(res);
  //     this.vendorList = res;
  //   });
  // }

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
    this.totalItem =
      this.inwardForm.get('prdQty')?.value *
      this.inwardForm.get('itemprebox')?.value;
    console.log(this.totalItem);
    this.inwardForm.patchValue({ totalPieces: this.totalItem });
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
        productCode: this.productData[0].prdCode,
        productId: this.productData[0].productId
      });
      console.log(total);
    }

    console.log("this.productList:",this.productList);

    this.inwardForm.reset(); 
    this.productData = '';
    this.isBox = false;
  }

  // inwardHeader(data: any) {
  //   // console.log(data);

  //   this.header = data;
  //   let branch: any[] = this._branch;
  //   let vendor: any[] = this.vendorList;
  //   let branchDetails = branch.find((f) => f.branchId == data.branchId);
  //   if (branchDetails) {
  //     this.header.branchName = branchDetails.branchName;
  //   }
  //   let vendorDetails = vendor.find((v) => v.vendorId == data.vendorId);
  //   if (this.inwardFormHeader.get('inwardFromCode')?.value == 269) {
  //     let vendorDetails = vendor.find((v) => v.vendorId == data.vendorId);
  //     this.header.vendorName = vendorDetails.vendorName;
  //   } else if (this.inwardFormHeader.get('inwardFromCode')?.value == 298) {
  //     let vendorDetails = branch.find((v) => v.branchId == data.vendorId);
  //     this.header.vendorName = vendorDetails.branchName;
  //   }
  //   console.log(this.header);
  // }
  inwardHeader(data: any) {
    console.log("inwardHeader add header btn:",data);

    this.header = data;

    if(this.inwardFormHeader.get('inwardFromCode')?.value === '269'){
      this.header.vendorId = this.selectedVendorId;
    }
    
    let branch: any[] = this._branch;
    let vendor: any[] = this.vendorData;

    console.log("vendor:", vendor);

    let branchDetails = branch.find((f) => f.branchId == data.vendorId);
    let vendorDetails = vendor?.find((v) => v.vendorId == data.vendorId);
    let branchDetails1 = branch.find((f) => f.branchId == data.branchId);
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

    console.log("this.header:", this.header);
  }

  deleteHeader() {
    this.header = '';
    console.log("while deleting the header:", this.header);
    // this.inwardFormHeader.get('vendorId')?.setValue(null);
    this.inwardFormHeader.reset();
  }

  closeSuccess(data: boolean) {
    this.isSuccess = data;
    this.resetComponent();
  }

  onSubmit() {
    let finalList = { ...this.header, transPrdDetails: this.productList };
    console.log("finalList:", finalList);
    this.productService.addInward(finalList).subscribe(
      (res) => {
        console.log("successfully submitting inward data:",res);
      },
      (error) => {
        if (error.status == 200) {
          console.log("error while saving inward data:",error);

          this.isSuccess = true;
          let successData = { show: 2, text: error.error.text };
          this.transactionID = successData;
        }
        console.log(error.error.text);
      },
    );
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
}
