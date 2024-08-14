import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { FunderService } from '../../service/Funder/funder.service';
import { VendorService } from '../../service/vendor/vendor.service';
import { from } from 'rxjs';
import { BranchService } from '../../service/Branch/branch.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'], // Fixed typo from `styleUrl` to `styleUrls`
})
export class RequestFormComponent implements OnInit {
  isHeader: boolean = true;
  isProductAdd: boolean = false;
  isTost: boolean = false;
  isOtherProduct: boolean = false;
  isEditHeader: boolean = false;
  isSuccessPop: boolean = false;
  isNeed: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  modelList: any;
  desList: any;

  requestIndentHead: FormGroup;
  productForm: FormGroup;
  programList: any;
  headofacc: any;
  date: Date = new Date();
  private intervalId: any;

  funder: any;
  vendor: any | undefined;

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  totalSum: number = 0;
  taxSum: number = 0;
  subtotalSum: number = 0;
  inwords: string = '';

  deleteToastMsg: any;

  employeeData: any | undefined;

  headerData: any;
  productList: any[] = [];
  selectedFunder: any;
  seletedVendor: any;
  funderList: any[] = [];
  vendorList: any[] = [];
  productData: any;
  successData: any;

  _department: any;
  program: any;

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
    private vendorService: VendorService,
    private branchService: BranchService,
  ) {
    this.requestIndentHead = this.fb.group({
      need: [],
      branchCode: [this.employeeData?.branchCode],
      deptId: [''],
      programId: [''],
      campName: [],

      requiredDate: [],
      expenditureId: [],
      requisitioner: [],
      notes: [],
    });
    this.productForm = this.fb.group({
      headOfAccId: [''],
      headOfAccName: [''],
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
    this.intervalId = setInterval(() => {
      this.date = new Date();
    }, 1000);

    this.fetchHeadofAcc();
    this.fetchUser();
    this.fetchGroupList();
    this.onChanges();
    this.fetchDeptList();
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

  need(data: any) {
    if (data == 1) {
      this.isNeed = true;
    }
  }

  fetchUser() {
    this.empService
      .getEmployeeDetails(sessionStorage.getItem('userId'))
      .subscribe((res: any) => {
        this.employeeData = res;
        console.log('j', res);
        this.requestIndentHead.patchValue({
          deptId: this.employeeData.empDepartment,
          branchCode: this.employeeData.branchCode,
        });
        this.fetchVendor();
        this.fetchFunder1();
      });
  }

  fetchHeadofAcc() {
    this.productService.getHeadofAccList().subscribe((res) => {
      console.log(res);
      this.headofacc = Object.entries(res).map(([id, value]) => ({
        id,
        value,
      }));
    });
  }

  fetchGroupList() {
    this.desList = '';
    this.productService.groupList().subscribe((res) => {
      this.groupList = res;

      console.log(res);
    });
  }

  fetchCatList(Id: any) {
    this.productService.catagoriesList(Id).subscribe((res) => {
      this.catList = res;
      this.brandList = [];
      this.modelList = [];
      this.desList = [];
      console.log(res);
    });
  }

  fetchBrandList(catId: any) {
    this.productService.brandList(catId).subscribe((res) => {
      this.brandList = res;
      this.modelList = [];
      this.desList = [];
      console.log(res);
    });
  }
  fetchModelList(brdId: any) {
    this.productService.getModelList(brdId).subscribe((res) => {
      console.log(res);
      this.modelList = res;
      this.desList = [];
    });
  }
  fetchProductDetails(brdId: any, modelName: any) {
    this.productService.getProductDes(brdId, modelName).subscribe((res) => {
      console.log(res);
      this.desList = res;
    });
  }

  fetchFunder1() {
    this.funderService
      .branchFunder(this.employeeData?.branchId)
      .subscribe((res: any) => {
        console.log('Branch Funder', res);
        this.funder = res;
      });
  }
  fetchVendor() {
    this.vendorService.getAllVendor().subscribe((res: any) => {
      let vendorList: any[] = res;

      this.vendor = vendorList.filter(
        (f) => f.branchId == this.employeeData?.branchId,
      );
      console.log(res, this.vendor);
    });
  }

  onSubmitHeader(data: any) {
    this.isEditHeader = true;
    Object.keys(this.requestIndentHead.controls).forEach((f) => {
      this.requestIndentHead.get(f)?.disable();
    });
    this.deleteToastMsg = 'Header Added Successfully';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000);
    this.headerData = data;
    console.log(data);
  }

  onEditHeader() {
    this.isEditHeader = false;
    Object.keys(this.requestIndentHead.controls).forEach((f) => {
      this.requestIndentHead.get(f)?.enable();
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
      headOfAccId: product.headOfAccId,
      headOfAccName: product.headOfAccName,
    });
  }

  addProductToList(product: any) {
    this.deleteToastMsg = 'Item Added';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000);

    const existingIndex = this.productList.findIndex(
      (p) => p.productId === product.productId,
    );

    if (existingIndex !== -1) {
      this.productList[existingIndex].qty += product.qty;
      this.productList[existingIndex].subtotal += this.subtotal;
      this.productList[existingIndex].tax += this.tax;
      this.productList[existingIndex].total += this.total;
    } else {
      let list = {
        ...product,
        subtotal: this.subtotal,
        tax: this.tax,

        total: this.total,
      };
      this.productList.push(list);
    }
    console.log(this.productList);
    this.productData = '';
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
  deleteFunder(i: any) {
    this.funderList?.splice(i, 1);
    this.deleteToastMsg = 'Funder Deleted';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000);
  }
  deleteVendor(i: any) {
    this.vendorList?.splice(i, 1);
    this.deleteToastMsg = 'Vendor Deleted';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000);
  }

  onSelectionValue(selectedValue: any, check: number) {
    if (check === 1) {
      this.selectedFunder = selectedValue;
      console.log('selected', selectedValue);
    } else if (check === 2) {
      this.seletedVendor = selectedValue;
      console.log('selected', selectedValue);
    }
  }
  addFunder() {
    const { funderId, funderCode, funderName, fundDetails, funderCatgName } =
      this.selectedFunder;
    let fd: any[] = fundDetails;
    let branch = fd?.filter((f) => f?.branchId == this.employeeData?.branchId);
    console.log('branch', branch);
    const funder = {
      funderId,
      funderCode,
      funderCatgName,
      funderName,
    };
    this.funderList.push(funder);

    console.log('list is ok', this.funderList);
  }
  addVendor() {
    const {
      vendorId,
      vendorName,
      vdrCountry,
      vdrContactPersonName,
      vdrContactPersonPhone,
      vendorAcccountDetails,
    } = this.seletedVendor;
    const vd: any[] = vendorAcccountDetails;

    const vendor = {
      vendorId,
      vendorName,
      vdrCountry,
      vdrContactPersonName,
      vdrContactPersonPhone,
      ...vendorAcccountDetails[0],
    };
    console.log(vendor);
    this.vendorList.push(vendor);
  }
  onSubmitIndent() {
    let indent = {
      ...this.headerData,
      totalPrice: this.totalSum,
      productDetails: this.productList,
      assgndVendors: this.vendorList,
      assignedDonors: this.funderList,
    };
    console.log(indent);
    this.requestService.postIndent(indent).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);

        if (error.status == 200) {
          this.productForm.reset();
          this.requestIndentHead.reset();
          this.productList = [];
          this.vendorList = [];
          this.togglePop(true);
          console.log(error.error.text);

          this.successData = { show: 3, text: `${error.error.text}` };
        }
      },
    );
  }
  serchByCode(code: string) {
    console.log(code);

    this.productService.getProductByCode(code).subscribe((product: any) => {
      console.log(product);
      this.productData = product;
      this.productForm.patchValue({
        productId: product.productId,
        qty: 1,
        productBrand: product.prdbrndName,
        productDesc: product.prdDescription,
        productCat: product.prdcatgName,
        productModel: product.prdmdlName,
        unitPrice: product.prdPurchasedPrice,
        gstpercentage: product.prdGstPct,
        headOfAccId: product.headOfAccId,
        headOfAccName: product.headOfAccName,
      });
    });
  }
  togglePop(data: boolean) {
    this.isSuccessPop = data;
  }
  toggleProduct(data: boolean) {
    this.isOtherProduct = data;
  }
  fetchDeptList() {
    this.branchService.getAllDepartments().subscribe((res: any) => {
      this._department = res;
      console.log(res);
      console.log(this._department);
    });
  }
  fetchProg(id: any) {
    this.branchService.getActiveProgram(id).subscribe((res: any) => {
      console.log(res);
      this.program = res.departProgram;
    });
  }
}
