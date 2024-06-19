import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { RequestService } from '../../service/Request/request.service';
import { ProductService } from '../../service/Product/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  @Input() product: any;
  @Output() close = new EventEmitter<boolean>();

  _commands: any;

  productUpdateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private shared: SharedServiceService,
    private requestService: RequestService,
    private productService: ProductService,
  ) {
    this.productUpdateForm = this.fb.group({
      id: [],
      qty: [],

      unitPrice: [],
      gstpercentage: [],
      commends: [],
    });
  }
  ngOnInit() {
    console.log('edit component', this.product);
    this.productUpdateForm.patchValue({
      id: this.product.id,
      unitPrice: this.product.unitPrice,
      qty: this.product.qty,
      gstpercentage: this.product.gstRate,
    });
    this.fetchCommands();
  }
  fetchCommands() {
    this.requestService.commands().subscribe((res) => {
      this._commands = res;
      console.log(res);
    });
  }

  submitChanges(data: any) {
    console.log(data);
    let itemPrice = this.shared.gstCalculation(
      data.qty,
      data.unitPrice,
      data.gstpercentage,
    );
    console.log('itemPrice', itemPrice);

    let finalList = {
      productDetails: [{ ...data }],

      sno: this.product.requestId,
    };
    console.log(finalList);

    this.requestService
      .updateRequest(this.product.requestId, finalList)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          if (error.status == 200) {
            this.close.emit(false);
          }
        },
      );
  }
}
