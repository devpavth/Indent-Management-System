import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { ProductService } from '../../../service/Product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { VendorService } from '../../../service/vendor/vendor.service';

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
  units: { id: number; name: string }[] = [
    { id: 1, name: 'Kg' },
    { id: 2, name: 'L' },
    { id: 3, name: 'm' },
    { id: 4, name: 'Unit' },
    { id: 200, name: 'Box' },
  ];
  productData: any;

  productList: any[] = [];

  vendorList: any;

  header: any;

  headerView: any;

  totalItem: number = 0;

  isSuccess: boolean = false;
  transactionID: object = {};

  constructor(
    private branchService: BranchService,
    private productService: ProductService,
    private fb: FormBuilder,
    private shared: SharedServiceService,
    private vendorService: VendorService,
  ) {
    this.inwardFormHeader = this.fb.group({
      tranRefNo: [],
      branchId: [],
      vendorId: [],
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
    this.fetchAllBranch();
    this.fetchVendorList();
  }
  fetchAllBranch() {
    this.branchService.getBranch().subscribe((res) => {
      console.log(res);

      this._branch = res;
    });
  }

  fetchProductData(data: string) {
    this.productService.getProductByCode(data).subscribe((res) => {
      console.log(res);
      this.productData = res;
      this.inwardForm.patchValue({
        productId: this.productData.productId,
        prdUnit: this.productData.prdUnit,

        prdQty: this.productData.prouctId,
        purchasedPrice: this.productData.prdPurchasedPrice,
        gstPercentage: this.productData.prdGstPct,
      });

      if (this.inwardForm.get('prdUnit')?.value == 200) {
        this.isBox = true;
        this.updateForm();
      }
    });
  }
  fetchVendorList() {
    this.vendorService.getVendorName().subscribe((res) => {
      console.log(res);
      this.vendorList = res;
    });
  }

  ifBox(data: any) {
    console.log(data);
    this.isBox = data == 200;

    this.updateForm();
  }
  updateForm() {
    if (this.isBox && !this.inwardForm.contains('totalPieces')) {
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
        prdUnit: this.productData.prdUnit,
        total,
        productCode: this.productData.prdCode,
      });
      console.log(total);
    }

    console.log(this.productList);

    this.inwardForm.reset();
    this.productData = '';
    this.isBox = false;
  }

  inwardHeader(data: any) {
    this.header = data;
    let branch: any[] = this._branch;
    let vendor: any[] = this.vendorList;
    let branchDetails = branch.find((f) => f.branchId == data.branchId);
    if (branchDetails) {
      this.header.branchName = branchDetails.branchName;
    }
    let vendorDetails = vendor.find((v) => v.vendorId == data.vendorId);
    if (vendorDetails) {
      this.header.vendorName = vendorDetails.vendorName;
    }
  }
  deleteHeader() {
    this.header = '';
  }

  closeSuccess(data: boolean) {
    this.isSuccess = data;
    this.resetComponent();
  }

  onSubmit() {
    let finalList = { ...this.header, inwardPrdDetails: this.productList };
    console.log(finalList);
    this.productService.addInward(finalList).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          console.log(error);

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
    this.fetchVendorList();
  }
}
