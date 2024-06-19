import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  isProductList: Boolean = false;
  productList: any;
  ngOnInit() {
    this.fetchProductList();
  }
  constructor(private productService: ProductService) {}
  fetchProductList() {
    this.productService.getAllProduct().subscribe((res) => {
      console.log(res);
      this.productList = res;
    });
  }
  closeView(close: Boolean) {
    this.isProductList = close;
  }
}
