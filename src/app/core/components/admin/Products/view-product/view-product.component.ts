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
export class ViewProductComponent {
  @Output() closeProduct = new EventEmitter<boolean>();
  @Input() productData: any;
  addingData: any;
  isCloseAdding: boolean = false;
  isSave = false;
  isEdit = true;
  isSaveIcon = true;
  isDelete = false;

  UpdateProductForm: FormGroup;
  constructor(private fb: FormBuilder) {
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
  closeProductView() {
    this.closeProduct.emit(false);
  }
}
