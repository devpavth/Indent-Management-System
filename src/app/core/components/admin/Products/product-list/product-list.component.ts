import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchSubject: Subject<string> = new Subject();

  isProductList: Boolean = false;
  productList: any[] | undefined;
  otherPrdLen: number = 0;
  productData: any;
  // Spinner: boolean = true;'
  isSkeletonLoader: boolean = true;
  noProduct: boolean = false;

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

  storeProductList: Product[] = [];
  noResults: boolean = false;
  isProductSelected: boolean = false;
  searchText: string = '';

  activeProduct: string = 'active';
  isShowPagination: boolean = true;

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          if (this.isProductSelected) {
            return of([]);
          }
          this.noResults = false;
          if (!searchTerm || searchTerm.length < 3) {
            this.storeProductList = [];
            return of([]);
          }

          let httpParams = new HttpParams().set('searchTerm', searchTerm);
          console.log('API Params:', httpParams.toString());

          return this.productService.fetchLiveProductDetails(httpParams).pipe(
            catchError((error) => {
              if (error.status === 404) {
                console.log('product api error:', error);
                this.noResults = true;
              }
              return of([]);
            }),
          );
        }),
      )
      .subscribe((response: Product[]) => {
        console.log('fetching product data from backend:', response);

        if (response.length > 0) {
          this.storeProductList = response;
        }
        this.isProductSelected = false;
      });

    this.fetchProductList(this.offSet, this.pageSize, 'active');
    this.fetchProductList(this.offSet, this.pageSize, 'other');
  }
  constructor(private productService: ProductService) {}

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchSubject.next(searchTerm);
  }

  onSelectProduct(product: Product) {
    this.isProductSelected = true;
    this.toggleView(true, 1, product);
    this.storeProductList = [];
    this.searchText = '';
  }

  clearSearch() {
    this.searchText = '';
    this.storeProductList = [];
    this.noResults = false;
  }

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

      // this.Spinner = false;
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

      this.noProduct = false;
      this.isSkeletonLoader = false;

      console.log('Current product list:', this.productList);
      console.log(
        'listLength:',
        this.listLength,
        'offSet:',
        this.offSet,
        'pageSize:',
        this.pageSize,
      );
    },
    (error: any) => {
        console.log(error);
        this.isSkeletonLoader = false;

        this.activeProduct = productType;

        if(productType === 'other'){
          this.isOtherProductView = true;
          this.isActiveProductView = false;

          this.productList = [];
        }else{
          this.isOtherProductView = false;
          this.isActiveProductView = true;

          this.productList = [];
        }

        this.noProduct = true;
        this.listLength = 0;

        // if (error.error.status === 404) {
        //   this.isSkeletonLoader = false;
        //   this.noProduct = true;
        // }

        // if(error.error.status === 204){
        //   this.noProduct = true; 
        // }
      }
    )
      
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
      console.log('check boolean:', check);
      console.log('productData:', productData);
      this.isProductList = action;
      this.productData = productData;
    }
    if (check == 0) {
      this.isProductList = action;
      this.fetchProductList(this.offSet, this.pageSize, 'active');
    }
  }
}
