import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { ProductService } from '../../service/Product/product.service';

@Component({
  selector: 'app-other-product',
  templateUrl: './other-product.component.html',
  styleUrl: './other-product.component.css',
})
export class OtherProductComponent {
  @Output() closeToggle = new EventEmitter<boolean>();
  @Output() throwOtherProduct = new EventEmitter<any>();
  otherProductForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private shared: SharedServiceService,
    private pService: ProductService,
  ) {
    this.otherProductForm = this.fb.group({
      configuration: [],
      purchasedPrice: [],
      createdBy: [this.shared?.loginUserData?.employeeId],
      createdOn: new Date(),
    });
  }

  postOtherProductDetails(data: any) {
    this.throwOtherProduct.emit(data);
    this.closeToggle.emit(false);
    console.log(data);
    this.pService.addOtherProduct(data).subscribe((res) => {
      console.log(res);
    });
  }
}
