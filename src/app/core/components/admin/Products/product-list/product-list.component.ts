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

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  list: any;
  listLength: any;

  isOtherProductView: boolean = false;
  isActiveProductView: boolean = false;
  activeProductList: any[] = [];
  otherProductList: any[] = [];

  ngOnInit() {
    this.fetchProductList(1, 'active');
    this.fetchProductList(2, 'other');
  }
  constructor(private productService: ProductService) {}
  fetchProductList(data: number, productType: 'active' | 'other') {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const productServiceCall = 
      productType === 'active' 
        ? this.productService.getAllProduct()
        : this.productService.fetchOtherProductDetails();

    productServiceCall.subscribe((res: any) => {
      console.log(`Fetching ${productType} product details:`, res);

      if(productType === 'active'){
        this.activeProductList = res;
        this.isActiveProductView = true;
        this.isOtherProductView = false;
      }else{
        this.otherProductList = res;
        this.isOtherProductView = true;
        this.isActiveProductView = false;
      }

      // this.list = res;
      const currentList = productType === 'active' ? this.activeProductList : this.otherProductList;
      this.listLength = currentList.length;

      // this.isActiveProductView = productType === 'active';
      // this.isOtherProductView = productType === 'other';

      let list: any[] = res;
      this.otherPrdLen = this.otherProductList.filter((m) => m.prdStatus == 303).length || 0;
      this.Spinner = false;
      switch (data) {
        case 1: {
          this.productList = list
            .filter((m) => m.prdStatus == 200)
            .slice(startIndex, endIndex);
          break;
        }
        case 2: {
          this.productList = list
            .filter((m) => m.prdStatus == 303)
            .slice(startIndex, endIndex);
          console.log('Hello');
          break;
        }
      }
    });
  }

  // fetchOtherProductList(data: number){
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.productService.fetchOtherProductDetails().subscribe(
  //     (res: any) => {
  //       console.log("fetching other product details:", res);
  //       this.isOtherProductView = true; 
  //       this.list = res;
  //       this.listLength = this.list.length;
  //       let list: any[] = res;
  //       this.otherPrdLen = list.filter((m) => m.prdStatus == 303).length;
  //       this.Spinner = false;
  //       switch (data) {
  //         case 1: {
  //           this.productList = list
  //             .filter((m) => m.prdStatus == 200)
  //             .slice(startIndex, endIndex);
  //           break;
  //         }
  //         case 2: {
  //           this.productList = list
  //             .filter((m) => m.prdStatus == 303)
  //             .slice(startIndex, endIndex);
  //           console.log('Hello');
  //           break;
  //         }
  //       }
  //     }
  //   )
  // }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchProductList(1, 'active');
  }
  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
  get startPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.listLength);
  }
  toggleView(action: Boolean, check: number, productData: any) {
    if (check == 1) {
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchProductList(1, 'active');
    }
  }
}
