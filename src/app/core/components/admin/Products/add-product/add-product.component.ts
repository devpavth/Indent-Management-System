import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  addingData: any;
  isCloseAdding: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  gst: any = [0, 5, 12, 18];

  ProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.ProductForm = this.fb.group({
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
      prdStatus: [200],
    });
  }
  ngOnInit(): void {
    this.fetchGroupList();
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

  fetchGroupList() {
    this.productService.groupList().subscribe((res) => {
      this.groupList = res;
      console.log(res);
    });
  }
  fetchCatList(Id: any) {
    this.productService.catagoriesList(Id).subscribe((res) => {
      this.catList = res;
      console.log(res);
    });
  }
  fetchBrandList(catId: any) {
    this.productService.brandList(catId).subscribe((res) => {
      this.brandList = res;
      console.log(res);
    });
  }

  ifBox(data: string) {
    if (data == '1') {
      console.log('hello');
    }
  }

  onSubmit(data: any) {
    this.productService.postProduct(data).subscribe((res) => {
      console.log(res);
    });
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
  }
}
