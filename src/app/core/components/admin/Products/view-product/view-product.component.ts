import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit {
  @Output() closeProduct = new EventEmitter<boolean>();
  @Output() productDeleted = new EventEmitter<number>();
  @Input() productData: any;

  productId: string = '';
  addingData: any;
  isCloseAdding: boolean = false;
  isSave: boolean = false;
  isEdit: boolean = true;
  isSaveIcon: boolean = true;
  isDelete: boolean = false;

  isStockView: boolean = false;
  deleteProduct: any;

  groupList: any;
  catList: any;
  brandList: any;
  gst: any = [0, 5, 12, 18];
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

  UpdateProductForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.UpdateProductForm = this.fb.group({
      prdGrpId: [],
      prdCatgId: [],
      prdBrndId: [],
      prdmdlName: [],
      prdDescription: [],
      prdUnit: [],
      prdHsnCode: [],
      prdPurchasedPrice: [],
      prdGstPct: [],
      prdMinQty: [],
      prdClosingStock: [],
      prdTotalValue: [],
      prdStatus: [200],
    });
  }
  ngOnInit(): void {
    this.UpdateProductForm.patchValue(this.productData);
    console.log("getting productData:", this.productData);
    console.log("getting productData with prdbrndName:", this.productData.prdbrndName);

    Object.keys(this.UpdateProductForm.controls).forEach((form) => {
      this.UpdateProductForm.get(form)?.disable();
    });
    this.fetchGroupList();
    this.fetchCatList(this.productData.prdGrpId);
    this.fetchBrandList(this.productData.prdCatgId);
  }

  addingAction(check: number) {
    this.isCloseAdding = true;
    if (check === 1) {
      this.addingData = { title: 'Add Group', Adding: 1 };
      console.log(this.addingData);
    }
    if (check === 2) {
      this.addingData = { title: 'Add Category', Adding: 2 };
      console.log(this.addingData);
    }
    if (check === 3) {
      this.addingData = { title: 'Add Brand', Adding: 3 };
      console.log(this.addingData);
    }
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
  }

  edit() {
    Object.keys(this.UpdateProductForm.controls).forEach((form) => {
      this.UpdateProductForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }

  fetchGroupList() {
    this.productService.groupList().subscribe((res) => {
      this.groupList = res;
      console.log("fetching group details:", res);
    });
  }
  fetchCatList(Id: any) {
    this.productService.catagoriesList(Id).subscribe((res) => {
      this.catList = res;
      console.log("fetching category list for selected product group:", res);
      
      // this.brandList = [];
      // return this.productService.brandList(this.productData.prdCatgId);
      // this.UpdateProductForm.get('prdBrndId')?.patchValue(null);
      // this.UpdateProductForm.get('prdBrndId')?.updateValueAndValidity(); 
    });
  }
  fetchBrandList(catId: any) {
    this.productService.brandList(catId).subscribe((res) => {
      this.brandList = res;
      console.log("fetching brand details for selected product group:", res);
    });
  }

  toggledelete(check: any, isView: boolean) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteProduct = {
        title: 'Product',
        action: 2,
        deleteId: this.productData.productId,
      };
      console.log("this.deleteProduct:",this.deleteProduct);

      this.productDeleted.emit(this.deleteProduct.deleteId);
      console.log("this.deleteProduct.deletedId:", this.deleteProduct.deleteId);
    } else if (check == 0) {
      this.isDelete = isView;
      this.closeProduct.emit(false);
    }
  }

  toggleStockView(check: number, isView: boolean) {
    if (check == 1) {
      this.isStockView = isView;
      this.productId = this.productData.productId;
      console.log(this.productId);
    } else if (check == 0) {
      this.isStockView = isView;
    }
  }
  onUpdateProduct(data: any) {
    console.log("successfully updated product data:", data);
  }
}
