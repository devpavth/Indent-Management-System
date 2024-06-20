import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunderService } from '../../core/components/service/Funder/funder.service';
import { ProductService } from '../../core/components/service/Product/product.service';
import { VendorService } from '../../core/components/service/vendor/vendor.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  @Input() deleteData: any;
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private funderService: FunderService,
    private productService: ProductService,
    private vendorService: VendorService,
  ) {}

  deleteFunction() {
    console.log(this.deleteData);

    if (this.deleteData.action == 1) {
      console.log(this.deleteData);
      this.funderService.deleteFunder(this.deleteData?.deleteId).subscribe(
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
    if (this.deleteData.action == 2) {
      console.log(this.deleteData);
      this.productService.deleteProduct(this.deleteData.deleteId).subscribe(
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
    if (this.deleteData.action == 3) {
      console.log(this.deleteData);
      this.vendorService.deleteVendor(this.deleteData.deleteId).subscribe(
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
}
