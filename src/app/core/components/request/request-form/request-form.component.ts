import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.css',
})
export class RequestFormComponent implements OnInit {
  //pipe declaration

  // UI RequestIdent name declaration
  _totalPrice: number = 0;

  _rItemList: any[] = []; //used for addinf request items to array

  _productName: any;

  _brandName: any;
  _model: any;
  _description: any;
  _hsn: any;
  _gst: any;
  _product: any;
  _indentId: any;
  requestProduct: FormGroup;
  //for visiable content declaration here

  visiable: boolean = false;
  emptyVisiable: boolean = true;
  successToast: boolean = false;
  isSuccess: boolean = false;
  showRequisitioner: boolean = false;
  isRequisitioner: boolean = true;
  isOther: boolean = false;
  isHeader: boolean = true;
  isProductAdd: boolean = false;

  reqName: any;

  constructor(
    private readonly ProductService: ProductService,
    private fb: FormBuilder,
    private requestService: RequestService,
    private shared: SharedServiceService,
  ) {
    this.requestProduct = this.fb.group({
      itemName: [],
      brandName: [],
      model: [],
      qty: [],
      unitPrice: [],
      itemPrice: [],
      hsnCode: [],

      description: [],
    });
  }
  ngOnInit(): void {
    this.fetchProduct();
  }

  // RequisitionerFunction(data: any) {
  //   this.reqName = data;
  //   this.isRequisitioner = false;
  //   this.showRequisitioner = true;
  // }

  // clearReqisition() {
  //   this.reqName = '';
  //   this.isRequisitioner = true;
  //   this.showRequisitioner = false;
  // }

  fetchProduct() {
    this.ProductService.getRequestPoduct().subscribe((res) => {
      console.log(res);
      this._productName = res;
    });
  }

  fetchBrand(productName: any) {
    this.ProductService.getRequestBrand(productName).subscribe((res) => {
      this._brandName = res;
    });
  }
  fetchModel(productName: any, brandName: any) {
    this.ProductService.getRequestModel(productName, brandName).subscribe(
      (res) => {
        this._model = res;
      },
    );
  }
  fetchDescription(productName: any, brandName: any, modelName: any) {
    this.ProductService.getRequestDescription(
      productName,
      brandName,
      modelName,
    ).subscribe((res: any) => {
      console.log(res);
      this._description = res;
    });
  }
  fetchProductDetails(desc: any) {
    console.log(desc);

    this.requestService.reqProduct(desc).subscribe((res) => {
      console.log(res);
      this._product = res;
      this.requestProduct.get('hsnCode')?.patchValue(this._product.hsnCode);
      this.requestProduct
        .get('unitPrice')
        ?.patchValue(this._product.purchasedPrice);
      this.requestProduct.get('qty')?.patchValue(1);
    });
  }

  submitHeader() {
    this.isHeader = false;
    this.isProductAdd = true;
  }

  // addRequestedProductItem(product: any) {
  //   if (this._rItemList.length > 0) {
  //     this.visiable = true;
  //     this.emptyVisiable = false;
  //   }

  //   this.emptyVisiable = false;
  //   this.visiable = true;
  //   let desc = this._product.configuration;

  //   let pTotal = Number(product.unitPrice) * Number(product.qty);

  //   let gstTotal = (this._product.gstpercentage / 100) * pTotal;
  //   let totalwithtax = gstTotal + pTotal;
  //   this._totalPrice += totalwithtax;
  //   console.log(gstTotal);
  //   console.log(totalwithtax);

  //   const rItem = {
  //     ...product,
  //     configration: desc,
  //     itemPrice: totalwithtax.toFixed(2),
  //     itemcode: this._product.itemcode,
  //     productId: this._product.sno,
  //     gstpercentage: this._product.gstpercentage,

  //     status: 200,
  //   };
  //   console.log(product);

  //   const existingProduct = this._rItemList.findIndex(
  //     (fin: any) => fin.itemName === product.itemName,
  //   );
  //   console.log(existingProduct);

  //   this._rItemList.push(rItem);
  //   console.log(this._rItemList);

  //   this.requestProduct.reset();
  // }

  addRequestedProductItem(product: any) {
    if (this._rItemList.length > 0) {
      this.visiable = true;
      this.emptyVisiable = false;
    }

    this.emptyVisiable = false;
    this.visiable = true;

    let desc = this._product.configuration;

    let pTotal = Number(product.unitPrice) * Number(product.qty);

    let gstTotal = (this._product.gstpercentage / 100) * pTotal;
    let totalwithtax = gstTotal + pTotal;
    this._totalPrice += totalwithtax;
    console.log(gstTotal);
    console.log(totalwithtax);

    const rItem = {
      ...product,
      configration: desc,
      itemPrice: totalwithtax.toFixed(2),
      itemcode: this._product.itemcode,
      productId: this._product.sno,
      gstpercentage: this._product.gstpercentage,
      status: 200,
    };
    console.log(product);

    const existingProductIndex = this._rItemList.findIndex(
      (fin: any) => fin.itemName === product.itemName,
    );
    console.log(existingProductIndex);

    if (existingProductIndex !== -1) {
      // Update the existing product's quantity and total price
      let existingProduct = this._rItemList[existingProductIndex];
      existingProduct.qty += product.qty;
      let newTotal =
        Number(existingProduct.unitPrice) * Number(existingProduct.qty);
      let newGstTotal = (existingProduct.gstpercentage / 100) * newTotal;
      let newTotalWithTax = newGstTotal + newTotal;
      existingProduct.itemPrice = newTotalWithTax.toFixed(2);
      console.log(existingProduct);
    } else {
      this._rItemList.push(rItem);
    }

    console.log(this._rItemList);

    this.requestProduct.reset();
  }

  // deleterItem(index: number, itemTotalPrice: number) {
  //   this._rItemList.splice(index, 1);
  //   this._totalPrice = this._totalPrice - itemTotalPrice;
  //   this.successToast = true;

  //   setTimeout(() => {
  //     this.successToast = false;
  //   }, 900);

  //   if (this._rItemList.length == 0) {
  //     this.visiable = false;
  //     this.emptyVisiable = true;
  //   }
  // }
  deleterItem(index: number) {
    // Get the item to be deleted
    const item = this._rItemList[index];

    // Subtract the item's price from the total price
    const itemTotalPrice = Number(item.itemPrice);
    this._totalPrice -= itemTotalPrice;

    // Remove the item from the list
    this._rItemList.splice(index, 1);

    this.successToast = true;

    setTimeout(() => {
      this.successToast = false;
    }, 900);

    if (this._rItemList.length == 0) {
      this.visiable = false;
      this.emptyVisiable = true;
    }
  }

  postRequestDetails() {
    let date = new Date();
    console.log(date);

    let requestList = {
      requisitioner: this.reqName,
      branchCode: this.shared.loginUserData.branchCode,
      empId: this.shared.loginUserData.employeeId,
      deptId: this.shared.loginUserData.empDepartment,
      createdOn: date,
      totalPrice: this._totalPrice.toFixed(2),
      productDetails: this._rItemList,
    };
    console.log(this.shared);

    console.log(requestList);

    this.requestService.postRequestIndent(requestList).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this._rItemList = [];
          this._totalPrice = 0;
          this._indentId = error.error.text;
          this.isSuccess = true;
          this.visiable = false;
          this.emptyVisiable = true;
          this.reqName = '';
          this.isRequisitioner = true;
          this.showRequisitioner = false;
        }
        if (error.status == 403) {
          console.log(error.error);
        }
      },
    );
  }
  closeOtherProduct(data: any) {
    this.isOther = data;
    this.fetchProduct();
  }

  getOtherProduct(data: any) {
    console.log(data);
    this._product.configuration = data.configuration;
    console.log(this._product.configuration);

    this._rItemList.push(data);
    if (this._rItemList.length > 0) {
      this.visiable = true;
      this.emptyVisiable = false;
    }

    this.emptyVisiable = false;
    this.visiable = true;
  }
}
