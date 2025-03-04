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

  offSet: number = 0;
  pageSize: number = 10;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  list: any;
  listLength: any;

  isOtherProductView: boolean = false;
  isActiveProductView: boolean = false;
  activeProductList: any[] = [];
  otherProductList: any[] = [];

  activeProduct: string = 'active';
  isShowPagination: boolean = true;

  ngOnInit() {
    this.fetchProductList(this.offSet, this.pageSize, 'active');
    this.fetchProductList(this.offSet, this.pageSize, 'other');
  }
  constructor(private productService: ProductService) {}

  fetchProductList(
    offSet: number,
    pageSize: number,
    productType: 'active' | 'other',
  ) {
    const startIndex = offSet * pageSize;
    const endIndex = startIndex + pageSize;

    console.log(
      'initail startIndex:',
      startIndex,
      'initail endIndex:',
      endIndex,
    );

    const productServiceCall =
      productType === 'active'
        ? this.productService.getAllProduct(offSet, pageSize)
        : this.productService.fetchOtherProductDetails();

    productServiceCall.subscribe((res: any) => {
      console.log(`Fetching ${productType} product details:`, res);

      if (productType === 'active') {
        this.activeProductList = res;
        // this.productList = this.activeProductList;
        this.isActiveProductView = true;
        this.isOtherProductView = false;

        this.isShowPagination = true;
      } else {
        this.otherProductList = res;
        // this.productList = this.otherProductList;
        this.isOtherProductView = true;
        this.isActiveProductView = false;

        this.isShowPagination = false;
      }

      this.activeProduct = productType;

      // this.list = res;
      const currentList =
        productType === 'active'
          ? this.activeProductList
          : this.otherProductList;

      this.listLength = currentList.length;
      console.log('this.listLength:', this.listLength);

      // this.isActiveProductView = productType === 'active';
      // this.isOtherProductView = productType === 'other';

      let list: any[] = res;
      console.log('list:', list);
      this.otherPrdLen =
        this.otherProductList.filter((m) => m.prdStatus == 303).length || 0;
      console.log('this.otherPrdLen:', this.otherPrdLen);

      this.Spinner = false;
      const totalItems = list.length;

      console.log('Active product:', this.activeProduct);
      // const startIndex = offSet * pageSize;
      // const endIndex = Math.min(startIndex + pageSize, totalItems);
      console.log('startIndex:', startIndex, 'endIndex:', endIndex);

      const filteredList = list.filter((m) => m.prdStatus === 200);
      console.log('Filtered active products:', filteredList);

      console.log('totalItems:', totalItems);

      switch (this.activeProduct) {
        case 'active': {
          console.log('this.activeProduct inside switch:', this.activeProduct);
          this.productList = list;

          console.log('list indise switch:', list);
          console.log('product list:', this.productList);
          break;
        }
        case 'other': {
          this.productList = list;

          console.log('Hello');
          break;
        }
      }

      console.log('Current product list:', this.productList);
      console.log(
        'listLength:',
        this.listLength,
        'offSet:',
        this.offSet,
        'pageSize:',
        this.pageSize,
      );
    });
  }

  onProductDeleted(productId: number) {
    console.log('Deleted product ID:', productId);

    this.activeProductList = this.activeProductList.filter(
      (product) => product.productId !== productId,
    );

    this.otherProductList = this.otherProductList.filter(
      (product) => product.productId !== productId,
    );

    this.otherPrdLen = this.otherProductList.filter(
      (m) => m.prdStatus === 303,
    ).length;
  }

  onProductUpdated(UpdatedProductId: any) {
    this.otherProductList = this.otherProductList.filter(
      (product) => product.productId !== UpdatedProductId,
    );

    this.otherPrdLen = this.otherProductList.filter(
      (m) => m.prdStatus === 303,
    ).length;
  }

  onPageChange(pageNumber: number): void {
    console.log('Current Offset:', this.offSet, 'New Offset:', pageNumber);
    // if (pageNumber >= 0 || pageNumber * this.pageSize < this.listLength) {
    //   return;
    // }

    this.offSet = pageNumber;
    this.fetchProductList(this.offSet, this.pageSize, 'active');

    if (this.activeProduct === 'other') {
      this.offSet = 0;
    }
  }
  getSerialNumber(index: number): number {
    if (this.activeProduct === 'other') {
      return index + 1;
    } else {
      return this.offSet * this.pageSize + index + 1;
    }
  }
  get startPage(): number {
    return this.pageSize * this.offSet + 1;
  }
  get endPage(): number {
    const calculatedEnd = (this.offSet + 1) * this.pageSize;
    return Math.max(calculatedEnd, this.listLength);
  }
  toggleView(action: Boolean, check: number, productData: any) {
    if (check == 1) {
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchProductList(this.offSet, this.pageSize, 'active');
    }
  }
}
