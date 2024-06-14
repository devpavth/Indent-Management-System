import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  isProductList: Boolean = false;
  closeView(close: Boolean) {
    this.isProductList = close;
  }
}
