import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { FunderService } from '../../service/Funder/funder.service';
import { VendorService } from '../../service/vendor/vendor.service';
import { catchError, debounceTime, from, of, switchMap, tap } from 'rxjs';
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

  branchDetails: any;
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

  isProductSelected: boolean = false;
  noResults: boolean = false;
  storeProductData: any[] = [];
  isVendorView: boolean = true;

  isEnableSave: boolean = false;
  storeTotal: number = 0;

  user: any;
  userData: any;

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
      priorityType: [],
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
    console.log("this.requestIndentHead.get('priorityType')?.value:", this.requestIndentHead.get('priorityType')?.value);

    this.requestIndentHead.get('priorityType')?.valueChanges
    .pipe(
      tap(this.requestIndentHead.get('priorityType')?.value)
    )

    this.intervalId = setInterval(() => {
      this.date = new Date();
    }, 1000);

    this.productForm.get('productId')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((searchTerm) => {
        console.log(`Product Name Changed for Index:`, searchTerm);
        if(this.isProductSelected){
          this.isProductSelected = false;
          this.isVendorView = true;
          return of([]);
        }
        this.noResults = false;
        this.storeProductData = [];
        if(!searchTerm?.trim() || !isNaN(searchTerm) || searchTerm.length < 3){
          return of([]);
        }
        return this.productService.fetchLiveProductDetails({searchTerm}).pipe(
          catchError((error) => {
            if(error.status === 404){
              console.log("error while fetching product data:", error);
              this.noResults = true;
            }
            return of([]);
          })
        )
      })
    ).subscribe(
      (response: any) => {
        this.storeProductData = response;
        console.log("fetching product data from backend:", response);

        this.isProductSelected = false;
      }
    )

    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.empService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log("this.userData:", this.userData);
        console.log("this.userData with empRole:", this.userData.empDesig);

        if(this.userData.empDesig === 10){
          console.log("checking..")
          this.isEnableSave = true;
        }

        // sessionStorage.setItem('branchId', this.userData.branchCode);
      });
    }

    this.fetchHeadofAcc();
    this.fetchUser();
    this.fetchGroupList();
    this.onChanges();
    this.fetchDeptList();

    console.log("this.total in ngOninit:", this.total);

    if(this.productForm.get('productForm')?.value > 5000){
      this.isVendorView = false;
    }
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

      if(this.total > 5000){
        console.log("this.total:", this.total);
        this.isVendorView = false;
      }else if(this.total <= 5000){
        this.isVendorView = true;
      }
    });
  }

    need(data: any) {
    console.log("data:", data);
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
        // this.fetchFunder1();
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

  // fetchFunder1() {
  //   this.funderService
  //     .branchFunder(this.employeeData?.branchId)
  //     .subscribe((res: any) => {
  //       console.log('Branch Funder', res);
  //       this.funder = res;
  //     });
  // }

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
    console.log("product:", product);
    this.isVendorView = false;
  
    this.deleteToastMsg = 'Item Added';
    this.isTost = true;
    setTimeout(() => {
      this.isTost = false;
    }, 3000);

    const existingIndex = this.productList.findIndex(
      (p) => p.productId === product.productId,
    );

    console.log("existingIndex:", existingIndex);

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
        productId: this.productData[0].productId
      };
      
      this.productList.push(list);
    }
    
    console.log("this.productList:", this.productList);

    this.storeTotal = this.productList[0]?.total;

    console.log("this.storeTotal:", this.storeTotal);

    if(this.storeTotal > 5000){
      this.isVendorView = false;
    }

    this.isVendorView = this.checkVendorView();
    console.log("Updated isVendorView:", this.isVendorView);

    this.productData = '';
    this.calculateSums();
    // this.productReset();
  }

    checkVendorView(): boolean {
    // Calculate total from the product list
      const total = this.productList.reduce((acc, product) => acc + product.total, 0);
      console.log("Calculated total in checkVendorView:", total);
    
      // Return true if total <= 5000 (show vendor view), false otherwise
      return total <= 5000;
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

  onSelectProduct(product: any){
    console.log("after selecting the product from the list", product);
    this.isProductSelected = true;
    this.productData = [product];

    console.log("productData:", this.productData);

    this.productForm.patchValue({
      // productId: product.productId,
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

    this.storeProductData = [];
  }

  serchByCode(code: string) {
    console.log(code);

    this.productService.getProductByCode(code).subscribe((product: any) => {
      console.log(product);
      this.productData = product;
      
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
    console.log("id:", id);
    this.branchService.getActiveProgram(id).subscribe((res: any) => {
      console.log("getting program details:", res);
      this.program = res.departProgram;
    });
  }
}
