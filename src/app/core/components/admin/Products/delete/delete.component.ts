import { Component, EventEmitter, Output } from '@angular/core';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  constructor(
    private adminService: AdminProductServiceService,
    private productService: ProductService,
  ) {}
  @Output() closeDeletePopup = new EventEmitter<number>();

  closeDelete() {
    this.closeDeletePopup.emit(0);
  }
  deleteProduct() {
    this.closeDeletePopup.emit(1);
  }
}
