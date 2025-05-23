import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FunderService } from '../../core/components/service/Funder/funder.service';
import { ProductService } from '../../core/components/service/Product/product.service';
import { VendorService } from '../../core/components/service/vendor/vendor.service';
import { BranchService } from '../../core/components/service/Branch/branch.service';
import { Router } from '@angular/router';
import { RequestService } from '../../core/components/service/Request/request.service';
import { ToastService } from '../../core/components/service/toast/toast.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  @Input() deleteData: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() deleteProduct = new EventEmitter<boolean>();
  @Output() deletePurchaseOrderItem = new EventEmitter<void>();

  route = inject(Router);
  toastService = inject(ToastService);

  constructor(
    private funderService: FunderService,
    private productService: ProductService,
    private vendorService: VendorService,
    private branchService: BranchService,
    private requestService: RequestService,
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
      console.log('deleting consoling product data:', this.deleteData);
      this.productService.deleteProduct(this.deleteData.deleteId).subscribe(
        (res) => {
          console.log('deleting product data:', res);
          this.route.navigate(['/home/productList']);
          this.close.emit(false);
        },
        (error) => {
          console.log('error while deleting product data:', error);
        },
      );
    }
    if (this.deleteData.action == 3) {
      console.log(this.deleteData);
      this.vendorService.deleteVendor(this.deleteData.deleteId).subscribe(
        (res) => {
          console.log('successfully deleting the vendor:', res);
          this.close.emit(false);
        },
        (error) => {
          console.log('error while deleting the vendor:', error);
          if (error.status == 200) {
            this.close.emit(false);
          }
        },
      );
    }

    ///action 4
    if (this.deleteData.action == 4) {
      console.log(this.deleteData);
      this.branchService.deleteDepartment(this.deleteData.deleteId).subscribe(
        (res: any) => {
          console.log(res);
          this.toastService.showSuccess(res.error);
          setTimeout(() => {
            this.close.emit(false);
          }, 3000);
        },
        (error) => {
          console.log(error);

          if (error.status == 200) {
            this.close.emit(false);
          }
        },
      );
    }

    if (this.deleteData.action == 5) {
      console.log(this.deleteData);
      this.branchService.deleteProj(this.deleteData.deleteId).subscribe(
        (res: any) => {
          console.log(res);
          this.toastService.showSuccess(res.error);
          setTimeout(() => {
            this.close.emit(false);
            this.route.navigate(['/home/viewList/2']);
          }, 3000);
        },
        (error) => {
          console.log(error);

          if (error.status == 200) {
            this.close.emit(false);
          }
        },
      );
    }

    if (this.deleteData.action === 6) {
      this.deleteProduct.emit(this.deleteData);
      this.close.emit(false);
    }
    if (this.deleteData.action === 7) {
      this.requestService
        .deletePOItemFromList(this.deleteData.deleteId)
        .subscribe(
          (res: any) => {
            console.log('successfully deleted PO item:', res);
            this.toastService.showSuccess(res.errorMessege);
            setTimeout(() => {
              this.deletePurchaseOrderItem.emit();
              this.close.emit(false);
            }, 3000);
          },
          (error) => {
            console.log('error while deleting PO Item:', error);
          },
        );
    }

    if(this.deleteData.action === 8){
      console.log(this.deleteData);
      this.requestService.deleteModeOfPayment(this.deleteData.deleteId).subscribe(
        (res: any) => {
          console.log("successfully deleted mode of payment:", res);
          this.toastService.showSuccess(res.errorMessege);
          setTimeout(() => {
            this.route.navigate(['/home/modeOfPayment']);
            this.close.emit(false);
          }, 1000);
        },
        (error) => {
          console.log("error while deleting mode of payment:", error);
        }
      )
    }
  }
}
