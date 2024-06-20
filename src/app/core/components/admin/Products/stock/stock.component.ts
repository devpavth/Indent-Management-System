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
    { id: 2, name: 'g' },
    { id: 3, name: 'L' },
    { id: 4, name: 'mL' },
    { id: 5, name: 'm' },
    { id: 6, name: 'cm' },
    { id: 200, name: 'Box' },
  ];
  productData: any;

  productList: any[] = [];

  vendorList: any;

  header: any;

  totalItem: number = 0;
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
        prdUnit: this.productData.prouctId,

        prdQty: this.productData.prouctId,
        purchasedPrice: this.productData.prdPurchasedPrice,
        gstPercentage: this.productData.prdGstPct,
      });
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
    let noofbox = this.inwardForm.get('prdQty')?.value;
    let noofitem = this.inwardForm.get('itemprebox')?.value;
    this.totalItem = Number(noofbox) * Number(noofitem);
    console.log(this.totalItem);
    this.inwardForm.patchValue({ totalPieces: this.totalItem });
  }

  addProductList(data: any) {
    let total = this.shared.gstCalculation(
      data.prdQty,
      data.purchasedPrice,
      data.gstPercentage,
    );
    this.productList.push({
      ...data,
      total,
      productCode: this.productData.prdCode,
    });
    console.log(this.productList);
    console.log(total);

    this.inwardForm.reset();
    this.productData = '';
    this.isBox = false;
  }
  inwardHeader(data: any) {
    this.header = data;
    console.log(data);
  }
  onSubmit() {
    let finalList = { ...this.header, inwardPrdDetails: this.productList };
    console.log(finalList);
  }
}
