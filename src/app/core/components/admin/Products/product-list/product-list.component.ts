import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  isProductList: Boolean = false;
  productList: any[] | undefined;
  otherPrdLen: number = 0;
  productData: any;
  Spinner: boolean = true;
  ngOnInit() {
    this.fetchProductList(1);
  }
  constructor(private productService: ProductService) {}
  fetchProductList(data: number) {
    this.productService.getAllProduct().subscribe((res: any) => {
      console.log(res);
      let list: any[] = res;
      this.otherPrdLen = list.filter((m) => m.prdStatus == 303).length;
      this.Spinner = false;
      switch (data) {
        case 1: {
          this.productList = list.filter((m) => m.prdStatus == 200);
          break;
        }
        case 2: {
          this.productList = list.filter((m) => m.prdStatus == 303);
          console.log('Hello');
          break;
        }
      }
    });
  }

  toggleView(action: Boolean, check: number, productData: any) {
    if (check == 1) {
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchProductList(1);
    }
  }
}
