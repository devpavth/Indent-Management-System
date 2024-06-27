import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { FunderService } from '../../service/Funder/funder.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'], // Fixed typo from `styleUrl` to `styleUrls`
})
export class RequestFormComponent implements OnInit {
  isHeader: boolean = true;
  isProductAdd: boolean = false;
  isTost: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  modelList: any;
  desList: any;

  requestIndentHead: FormGroup;
  productForm: FormGroup;
  programList: any;
  headofacc: any;
  date = Date();

  funder: any;

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  totalSum: number = 0;
  taxSum: number = 0;
  subtotalSum: number = 0;
  inwords: string = '';

  deleteToastMsg: any;

  employeeData: any;
  productList: any[] = [];
  selectedFunder: any;
  funderList: any[] = [];

  @ViewChild('catid', { static: false }) catid: ElementRef<any> | undefined;
  @ViewChild('id', { static: false }) id: ElementRef<any> | undefined;
  @ViewChild('brdId', { static: false }) brdId: ElementRef<any> | undefined;
  @ViewChild('mName', { static: false }) mName: ElementRef<any> | undefined;
  @ViewChild('des', { static: false }) des?: ElementRef<any> | undefined;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private requestService: RequestService,
    private empService: EmployeeServiceService,
    private shared: SharedServiceService,
    private funderService: FunderService,
  ) {
    this.requestIndentHead = this.fb.group({
      branchCode: [],
      deptId: [],
      programId: [''],
      campName: [],
      headOfAccId: [''],
      requiredDate: [],
      expenditureId: [],
      requisitioner: [],
      notes: [],
    });
    this.productForm = this.fb.group({
      productId: [],
      productBrand: [],
      productCat: [],
      productDesc: [],
      productModel: [],
      qty: [0],
      unitPrice: [0],
      gstpercentage: [],
      status: [200],
    });
  }

  ngOnInit() {
    this.fetchProgram();
    this.fetchHeadofAcc();
    this.fetchUser();
    this.fetchGroupList();
    this.onChanges();
    this.fetchFunder();
  }
  onChanges(): void {
    this.productForm.valueChanges.subscribe((val) => {
      const unitPrice = parseFloat(val.unitPrice) || 0;
      const qty = parseInt(val.qty) || 0;
      const gstpercentage = parseFloat(val.gstpercentage) || 0;
      let gst = this.shared.gstCalculation(qty, unitPrice, gstpercentage);

      this.subtotal = unitPrice * qty;
      this.tax = gst.gstAmt;
      this.total = gst.itemPrice;
    });
  }
  fetchUser() {
    this.empService
      .getEmployeeDetails(sessionStorage.getItem('userId'))
      .subscribe((res: any) => {
        this.employeeData = res;
        console.log('j', res);
      });
  }
  fetchProgram() {
    this.requestService.getProgramList().subscribe((res: any) => {
      console.log(res);
      this.programList = Object.entries(res).map(([id, value]) => ({
        id,
        value,
      }));

      console.log(this.programList);
    });
  }

  fetchHeadofAcc() {
    this.requestService.getHeadofAccList().subscribe((res) => {
      console.log(res);
      this.headofacc = Object.entries(res).map(([id, value]) => ({
        id,
        value,
      }));
    });
  }

  fetchGroupList() {
    this.productService.groupList().subscribe((res) => {
      this.groupList = res;
      console.log(res);
    });
  }

  fetchCatList(Id: any) {
    this.productService.catagoriesList(Id).subscribe((res) => {
      this.catList = res;
      console.log(res);
    });
  }

  fetchBrandList(catId: any) {
    this.productService.brandList(catId).subscribe((res) => {
      this.brandList = res;
      console.log(res);
    });
  }
  fetchModelList(brdId: any) {
    this.productService.getModelList(brdId).subscribe((res) => {
      console.log(res);
      this.modelList = res;
    });
  }
  fetchProductDetails(brdId: any, modelName: any) {
    this.productService.getProductDes(brdId, modelName).subscribe((res) => {
      console.log(res);
      this.desList = res;
    });
  }

  fetchFunder() {
    this.funderService.funderList().subscribe((res) => {
      console.log(res);
      this.funder = res;
    });
  }

  patchProductData(id: any) {
    let prdList: any[] = this.desList;
    let product = prdList.find((f) => f.productId == id);
    console.log('find', product);
    this.productForm.patchValue({
      productId: product.productId,
      qty: 1,
      productBrand: product.prdbrndName,
      productDesc: product.prdDescription,
      productCat: product.prdcatgName,
      productModel: product.prdmdlName,
      unitPrice: product.prdPurchasedPrice,
      gstpercentage: product.prdGstPct,
    });
  }

  addProductToList(product: any) {
    this.deleteToastMsg = 'Item Added';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000);
    let list = {
      ...product,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
    };
    console.log(list);
    this.productList.push(list);
    console.log(this.productList);
    this.calculateSums();
    this.productReset();
  }
  calculateSums() {
    this.totalSum = this.productList.reduce(
      (sum, product) => sum + product.total,
      0,
    );
    this.taxSum = this.productList.reduce(
      (sum, product) => sum + product.tax,
      0,
    );
    this.subtotalSum = this.productList.reduce(
      (sum, product) => sum + product.subtotal,
      0,
    );
    this.inwords = this.shared.inWords(this.totalSum);
  }

  productReset() {
    this.productForm.reset();
    this.catid?.nativeElement && (this.catid.nativeElement.value = '');
    this.id?.nativeElement && (this.id.nativeElement.value = '');
    this.brdId?.nativeElement && (this.brdId.nativeElement.value = '');
    this.mName?.nativeElement && (this.mName.nativeElement.value = '');
    this.des?.nativeElement && (this.des.nativeElement.value = '');
  }

  deleteProduct(i: any) {
    this.productList.splice(i, 1);
    this.deleteToastMsg = 'Item Deleted';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000); // Hide the toast after 3 seconds
    this.calculateSums();
  }

  onSelectionValue(selectedValue: any) {
    this.selectedFunder = selectedValue;
    console.log('selected', selectedValue);
  }
  addFunder() {
    const { funderId, funderCode, funderName, fundDetails, funderCatgName } =
      this.selectedFunder;
    let fd: any[] = fundDetails;
    let branch = fd.filter((f) => f.branchId == this.employeeData.branchId);
    console.log('branch', branch);
    const funder = {
      funderId,
      funderCode,
      funderCatgName,
      funderName,
      ...branch[0],
    };
    this.funderList.push(funder);

    console.log(this.funderList);
  }
}
