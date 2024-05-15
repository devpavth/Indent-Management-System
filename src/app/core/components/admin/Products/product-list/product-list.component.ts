import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  constructor(
    private productService: ProductService,
    private adminProduct: AdminProductServiceService,
    private datePipe: DatePipe,
    private userdata: SharedServiceService,
  ) {}

  userid: any = this.userdata.loginUserData?.sno;
  productList: any = [];

  list: any = [];
  date = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

  searchText = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  lenthofOther: number = 0;
  otherlist: any;

  viewProductVisiable = false; //product visiable
  isSaveSuccess = false;
  isDeletePop = false;
  isAuth: boolean = false;
  isProduct: boolean = false;
  Spinner: boolean = true;
  isAllProduct: boolean = true;
  isOther: boolean = false;

  productCode: string | undefined;

  ngOnInit(): void {
    console.log(this.userid);
    this.loadOtherProduct();
    this.loadProducts();
    this.productService.refrechData.subscribe((res) => {
      this.loadProducts();
    });
  }
  ngOnDestroy(): void {
    this.productService.refrechData.unsubscribe();
  }

  loadProducts() {
    this.loadOtherProduct();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (this.isAllProduct === true && this.isOther === false) {
      this.productService.getAllProduct(this.userid).subscribe(
        (res) => {
          this.isProduct = true;
          this.Spinner = false;
          console.log(res);

          this.list = res;
          this.productList = this.list.slice(startIndex, endIndex);
          console.log(this.productList);

          this.totalpage += this.productList.length;
          console.log(this.currentPage * this.itemsPerPage);
        },
        (error) => {
          if (error.status == 403) {
            this.Spinner = false;
            this.isAuth = true;
          }
        },
      );
    }
    if (this.isOther === true && this.isAllProduct === false) {
      this.productList = [];
      this.productService.getAllOtherProduct().subscribe(
        (res) => {
          this.isProduct = true;
          this.Spinner = false;
          console.log(res);

          this.list = res;
          this.productList = this.list.slice(startIndex, endIndex);
          console.log(this.productList);

          this.totalpage += this.productList.length;
          console.log(this.currentPage * this.itemsPerPage);
        },
        (error) => {
          if (error.status == 403) {
            this.Spinner = false;
            this.isAuth = true;
          }
        },
      );
    }
  }

  loadOtherProduct() {
    this.productService.getAllOtherProduct().subscribe((res) => {
      this.otherlist = res;
      this.lenthofOther = this.otherlist.length;
      console.log('lenth of the Other list', this.lenthofOther);
    });
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadProducts();
  }

  toggleViewProduct(itemCode: any) {
    this.viewProductVisiable = true;
    console.log(itemCode);
    this.productCode = itemCode;
  }
  onCloseViewProduct(data: boolean) {
    this.viewProductVisiable = data;
  }

  viewSucessPopup(data: boolean) {
    this.isSaveSuccess = data;
    this.viewProductVisiable = !data;
  }
  closeSaveSuccess(data: boolean) {
    this.isSaveSuccess = data;
  }
  deletepop(data: number) {
    if (data == 1) {
      this.productService
        .deleteProduct(this.adminProduct.productCode)
        .subscribe(
          (res) => {},
          (error) => {
            if (error.status == 200) {
              this.loadProducts();
            }
          },
        );

      this.isDeletePop = false;
    } else {
      this.isDeletePop = false;
    }
  }

  showDeletePop(data: boolean) {
    this.isDeletePop = data;
    this.viewProductVisiable = !data;
  }

  exportToExcel(): void {
    // Create a title row
    const title = ['Product Details'];
    // Create a header row
    const header = [
      'Product Name',
      'Brand',
      'Model',
      'HSN Code',
      'Description',
      'GST %',
      'Price',
    ];
    const emptyRow: never[] = [];

    // Combine header and data
    const exportData = [
      title,
      emptyRow,
      header,
      ...this.list.map(
        (product: {
          itemName: any;
          brandName: any;
          model: any;
          hSNCode: any;
          configuration: any;
          gstpercentage: any;
          purchasedPrice: any;
        }) => [
          product.itemName,
          product.brandName,
          product.model,
          product.hSNCode,
          product.configuration,
          `${product.gstpercentage}%`,
          product.purchasedPrice,
        ],
      ),
    ];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

    // Create a new workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'product');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `product[${this.date}].xlsx`);
    console.log(this.date);
  }
}
