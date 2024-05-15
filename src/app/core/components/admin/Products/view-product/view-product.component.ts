import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit {
  @Output() closeViewProduct = new EventEmitter<boolean>();
  @Output() viewSucess = new EventEmitter<boolean>();
  @Output() showDeletePop = new EventEmitter<boolean>();
  @Input() isOther: boolean | undefined;

  @Input() ProductCode: any;

  productDeatils: any;
  productUpdateForm: any;
  gst: any = [5, 12, 18, 28];

  errorMsg: string = '';

  isSave: boolean = false;
  isEdit: boolean = true;
  isSaveIcon: boolean = true;
  isLoad: boolean = false;
  isError: boolean = false;
  isAllProductAction = true;
  isOsave = false;

  constructor(
    private GetProductDetailsService: ProductService,
    public adminService: AdminProductServiceService,
  ) {}

  ngOnInit(): void {
    if (this.isOther == true) {
      this.isAllProductAction = false;
    }
    console.log(this.ProductCode);

    this.GetProductDetailsService.getProductDetails(this.ProductCode).subscribe(
      (res) => {
        this.productDeatils = res;
        console.log(res);
        this.productUpdateForm = new FormGroup({
          sno: new FormControl(this.productDeatils.sno),
          itemcode: new FormControl(this.productDeatils.itemcode),
          itemName: new FormControl(this.productDeatils.itemName, [
            Validators.required,
          ]),
          brandName: new FormControl(this.productDeatils.brandName),
          model: new FormControl(this.productDeatils.model),
          hsnCode: new FormControl(this.productDeatils.hsnCode),
          configuration: new FormControl(this.productDeatils.configuration),
          purchasedPrice: new FormControl(this.productDeatils.purchasedPrice),
          gstpercentage: new FormControl(this.productDeatils.gstpercentage),
          createdOn: new FormControl(this.productDeatils.createdOn),
          createdBy: new FormControl(this.productDeatils.createdBy),
          modifiedby: new FormControl(sessionStorage.getItem('userId')),
          modifiedOn: new FormControl(new Date()),
        });

        this.productUpdateForm.get('itemName').disable();
        this.productUpdateForm.get('brandName').disable();
        this.productUpdateForm.get('model').disable();
        this.productUpdateForm.get('hsnCode').disable();
        this.productUpdateForm.get('configuration').disable();
        this.productUpdateForm.get('purchasedPrice').disable();
        this.productUpdateForm.get('gstpercentage').disable();
      },
    );
  }

  edit() {
    this.productUpdateForm.get('itemName').enable();
    this.productUpdateForm.get('brandName').enable();
    this.productUpdateForm.get('model').enable();
    this.productUpdateForm.get('hsnCode').enable();
    this.productUpdateForm.get('configuration').enable();
    this.productUpdateForm.get('purchasedPrice').enable();
    this.productUpdateForm.get('gstpercentage').enable();

    this.isSave = true;
    this.isEdit = false;
  }
  UpdateProduct(data: any) {
    console.log(data);
    this.isSaveIcon = false;
    this.isLoad = true;

    this.GetProductDetailsService.updateProduct(data).subscribe(
      (res: any) => {
        console.log(res, 'venki');
        console.log(data);

        this.isLoad = false;

        this.viewSucess.emit(true);
      },
      (error) => {
        console.log(error.error);

        if (error.status == 400) {
          this.isLoad = false;
          this.isError = true;
          this.errorMsg = error.error;

          // this.ngOnInit()
        }
      },
    );
  }
  deleteProduct(data: any) {
    this.showDeletePop.emit(true);

    this.adminService.productCode = data;
  }

  errorToggle() {
    this.isError = !this.isError;
    this.edit();

    this.isSaveIcon = true;
  }
  updateOtherPorduct(data: any) {
    this.GetProductDetailsService.updateOtherProduct(data).subscribe((res) => {
      console.log(res);
      this.viewSucess.emit(true);
      this.closeViewProduct.emit(false);
    });
  }
}
