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
  productData: any;
  Spinner: boolean = true;
  ngOnInit() {
    this.fetchProductList();
  }
  constructor(private productService: ProductService) {}
  fetchProductList() {
    this.productService.getAllProduct().subscribe((res) => {
      console.log(res);
      this.productList = res;
      this.Spinner = false;
    });
  }

  toggleView(action: Boolean, check: number, productData: any) {
    if (check == 1) {
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchProductList();
    }
  }
}
