import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { FunderService } from '../../service/Funder/funder.service';
import { VendorService } from '../../service/vendor/vendor.service';
import { catchError, debounceTime, from, of, switchMap, tap } from 'rxjs';
import { BranchService } from '../../service/Branch/branch.service';
import { HttpParams } from '@angular/common/http';
import { Product } from '../../../models/product/product.model';
import { ToastService } from '../../service/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
})
export class RequestFormComponent implements OnInit {
  isHeader: boolean = true;
  isProductAdd: boolean = false;
  isOtherProduct: boolean = false;
  isEditHeader: boolean = false;
  isSuccessPop: boolean = false;
  isNeed: boolean = false;
  isBox: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  modelList: any;
  desList: any;

  requestIndentHead: FormGroup;
  productForm: FormGroup;
  assignedVendor: FormGroup;
  programList: any;
  headofacc: any;
  date: Date = new Date();
  currentDate: string | undefined;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  funder: any;
  vendor: any | undefined;

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  totalSum: number = 0;
  taxSum: number = 0;
  subtotalSum: number = 0;

  toastService = inject(ToastService);
  route = inject(Router);

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
  suppressValueChanges: boolean = false;
  storeProductData: Product[] = [];
  isVendorView: boolean = true;

  isEnableSave: boolean = false;
  isEnableSaveBtn: boolean = false;
  loader: boolean = false;

  storeTotal: number = 0;

  user: any;
  userData: any;

  isVendorSelected: boolean = false;
  noVendor: boolean = false;
  storeVendorList: any[] = [];

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
      priorityType: [Validators.required],
      branchCode: [this.employeeData?.branchCode],
      deptId: [null, Validators.required],
      programId: [null, Validators.required],
      campName: ['', Validators.required],

      requiredDate: ['', Validators.required],
      expenditureId: [null, Validators.required],
      requisitioner: ['', Validators.required],
      notes: [],
    });

    this.assignedVendor = this.fb.group({
      vendorId: [],
      vdrAccId: [],
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
      prdGstPct: [],
      status: [200],
    });

    this.currentDate = this.date.toISOString().split('T')[0];
  }

  ngOnInit() {
    console.log(
      'checking:',
      this.requestIndentHead.get('requestIndentHead')?.value,
    );
    this.intervalId = setInterval(() => {
      this.date = new Date();
    }, 1000);

    this.productForm
      .get('productId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          console.log(`Product Name Changed for Index:`, searchTerm);
          if (this.suppressValueChanges) {
            this.suppressValueChanges = false;
            return of([]);
          }

          this.isProductSelected = false;
          this.noResults = false;
          this.storeProductData = [];
          if (
            !searchTerm?.trim() ||
            !isNaN(searchTerm) ||
            searchTerm.length < 3
          ) {
            // this.isVendorView = true;
            return of([]);
          }

          let httpParams = new HttpParams().set('searchTerm', searchTerm);

          return this.productService.fetchLiveProductDetails(httpParams).pipe(
            catchError((error) => {
              if (error.status === 404) {
                console.log('error while fetching product data:', error);
                this.noResults = true;
              }
              return of([]);
            }),
          );
        }),
      )
      .subscribe((response: Product[]) => {
        this.storeProductData = response;
        console.log('fetching product data from backend:', response);

        // this.isProductSelected = false;
      });

    this.assignedVendor
      .get('vendorId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          console.log(`vendor Name Changed for Index:`, searchTerm);
          if (this.isVendorSelected) {
            this.isVendorSelected = false;
            return of([]);
          }
          this.noVendor = false;
          this.storeVendorList = [];
          if (
            !searchTerm?.trim() ||
            !isNaN(searchTerm) ||
            searchTerm.length < 3
          ) {
            return of([]);
          }
          return this.productService
            .fetchLiveVendorDetails({ searchTerm })
            .pipe(
              catchError((error) => {
                if (error.status === 404) {
                  console.log('error while fetching vendor data:', error);
                  this.noVendor = true;
                }
                return of([]);
              }),
            );
        }),
      )
      .subscribe((response: any) => {
        this.storeVendorList = response;
        console.log('fetching vendor data from backend:', response);

        this.storeVendorList = this.storeVendorList.filter(
          (f) => f.branchId == this.employeeData?.branchId || f.branchId == 0,
        );

        this.isVendorSelected = false;
      });

    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.empService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log('this.userData:', this.userData);
        console.log('this.userData with empRole:', this.userData.empDesig);

        // if(this.userData.empDesig === 10){
        //   console.log("checking..")
        //   this.isEnableSave = true;
        // }

        // sessionStorage.setItem('branchId', this.userData.branchCode);
      });
    }

    this.fetchHeadofAcc();
    this.fetchUser();
    this.fetchGroupList();
    this.onChanges();
    this.fetchDeptList();

    console.log('this.total in ngOninit:', this.total);

    // if(this.storeTotal){
    //   this.isVendorView = true
    // }

    // if(this.productForm.get('productForm')?.value > 5000){
    //   this.isVendorView = false;
    // }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onChanges(): void {
    this.productForm.valueChanges.subscribe((val) => {
      const unitPrice = parseFloat(val.unitPrice) || 0;
      const qty = parseInt(val.qty) || 0;
      const gstpercentage = parseFloat(val.prdGstPct) || 0;
      let gst = this.shared.gstCalculation(qty, unitPrice, gstpercentage);

      this.subtotal = unitPrice * qty;
      this.tax = gst.gstAmt;
      this.total = gst.itemPrice;

      if (this.total > 5000) {
        console.log('this.total:', this.total);
        this.isVendorView = false;
      } else if (this.total <= 5000) {
        this.isVendorView = true;
      }
    });
  }

  need(data: any) {
    console.log('data:', data);
    if (data == 108) {
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
    console.log('header data:', data);
    this.isEditHeader = true;
    Object.keys(this.requestIndentHead.controls).forEach((f) => {
      if (f !== 'assgndVendors') {
        this.requestIndentHead.get(f)?.disable();
      } else {
        const assgndVendorsGroup = this.requestIndentHead.get(
          'assgndVendors',
        ) as FormGroup;
        Object.keys(assgndVendorsGroup.controls).forEach((nestedKey) => {
          assgndVendorsGroup.get(nestedKey)?.enable();
        });
      }
    });

    this.toastService.showSuccess('Header Added Successfully');
    this.headerData = data;
    console.log(data);
    this.isEnableSaveBtn = true;
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
      prdGstPct: product.prdGstPct,
      headOfAccId: product.headOfAccId,
      headOfAccName: product.headOfAccName,
    });
  }

  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

    const input = event.target as HTMLInputElement;
    if (input.value.length >= 9) {
      event.preventDefault();
    }
  }

  addProductToList(product: any) {
    /*  */
    // this.productForm.reset();
    /*  */
    console.log('product:', product);
    //this.isVendorView = false;

    this.toastService.showSuccess('Item Added');

    const existingIndex = this.productList.findIndex(
      (p) => p.productId === product.productId,
    );

    console.log('existingIndex:', existingIndex);

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
        productId: this.productData[0].productId,
      };

      this.productList.push(list);
    }

    console.log('this.productList:', this.productList);

    this.storeTotal = this.productList[0]?.total;

    console.log('this.storeTotal:', this.storeTotal);

    var finalAmt = product.unitPrice;

    if (finalAmt > 5000) {
      this.isVendorView = false;
    }

    this.isEnableSave = true;
    this.productData = '';
    this.calculateSums();
    this.productForm.reset();
    // this.productReset();
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

    this.toastService.showSuccess('Item Deleted');
    this.calculateSums();
  }
  deleteFunder(i: any) {
    this.funderList?.splice(i, 1);

    this.toastService.showSuccess('Funder Deleted');
  }
  deleteVendor(i: any) {
    this.vendorList?.splice(i, 1);

    this.toastService.showSuccess('Vendor Deleted');
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

    console.log('this.seletedVendor:', this.seletedVendor);
    const vd: any[] = vendorAcccountDetails;

    const vendor = {
      vendorId,
      vendorName,
      vdrCountry,
      vdrContactPersonName,
      vdrContactPersonPhone,
      ...vendorAcccountDetails[0],
    };
    console.log('in add vendor:', vendor);
    this.vendorList.push(vendor);
  }

  onSelectedVendor(vendor: any) {
    console.log('after selecting the vendor:', vendor);

    this.isVendorSelected = true;

    // this.vendorList = [vendor];
    this.vendorList.push({
      vendorId: vendor.vendorId,
      vdrAccId: vendor.vendorAcccountDetails[0]?.vdrAccId,
      vendorName: vendor.vendorName,
      vdrContactPersonName: vendor.vdrContactPersonName,
      vdrContactPersonPhone: vendor.vdrContactPersonPhone,
      vdrCountry: vendor.vdrCountry,
    });

    console.log('selected vendor list:', this.vendorList);

    this.assignedVendor.patchValue({
      // vendorId: vendor.vendorId,
      vdrAccId: vendor.vendorAcccountDetails[0]?.vdrAccId,
    });

    // this.vendorList = this.assignedVendor?.value;
    console.log('selected vendor list after assignedVendor:', this.vendorList);

    console.log('this.vendor:', this.vendor);

    this.storeVendorList = [];
  }

  onSubmitIndent() {
    let indent = {
      ...this.headerData,
      totalPrice: this.totalSum,
      productDetails: this.productList,
      // assignedDonors: this.funderList,
    };
    console.log('indent data:', indent);
    this.loader = true;

    this.requestService.postIndent(indent).subscribe(
      (res: any) => {
        console.log('successfully created indent request:', res);
        console.log('successfully created indent request:', res.errorMessege);
        this.productForm.reset();
        this.requestIndentHead.reset();
        this.assignedVendor.reset();
        this.productList = [];
        this.vendorList = [];
        this.isSuccessPop = true;
        this.successData = { show: 3, text: res.errorMessege };
        this.loader = false;
      },
      (error) => {
        console.log('error while creating indent request:', error);
        this.loader = false;

        if (error.status == 200) {
          this.productForm.reset();
          this.requestIndentHead.reset();
          this.productList = [];
          this.vendorList = [];
          this.togglePop(true);
          console.log(error.error.text);

          this.successData = { show: 3, text: `${error.error.text}` };
        } else if (error.status === 406) {
          console.log('error because product total is less than 500:', error);
          console.log(
            'error because product total is less than 500 checking:',
            error.error,
          );
          alert(error.error);
        }

        if (error.status === 400) {
          this.toastService.showError(error.error);
        }
      },
    );
  }

  onSelectProduct(product: Product) {
    console.log('after selecting the product from the list', product);
    this.isProductSelected = true;
    this.suppressValueChanges = true;
    this.productData = [product];

    console.log('productData:', this.productData);

    this.productForm.get('productId')?.setValue(product.prdcatgName),
      { emitEvent: true };

    const duplicateProducts = this.productList.find(
      (prd) => prd.productId === product.productId,
    );

    if (duplicateProducts) {
      this.toastService.showError('Product Already Exists in the Cart');
      this.productForm.get('productId')?.setValue('');
      this.isProductSelected = false;
      this.productData = [];
      this.storeProductData = [];
      return;
    }

    if(product.prdUnit === 200){
      this.isBox = true
    } else{
      this.isBox = false;
    }

    this.productForm.patchValue({
      // productId: product.productId,
      qty: 1,
      productBrand: product.prdbrndName,
      productDesc: product.prdDescription,
      productCat: product.prdcatgName,
      productModel: product.prdmdlName,
      unitPrice: product.prdPurchasedPrice,
      prdGstPct: product.prdGstPct,
      headOfAccId: product.headOfAccId,
      headOfAccName: product.headOfAccName,
      status: 200,
    });

    this.storeProductData = [];
  }

  clearSearch() {
    this.productForm.get('productId')?.setValue('');
    this.storeProductData = [];
    this.productForm.reset();
    this.noResults = false;
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
    this.route.navigate(['/home/request']);
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
    console.log('id:', id);
    this.branchService.getActiveProgram(id).subscribe((res: any) => {
      console.log('getting program details:', res);
      this.program = res.departProgram;
    });
  }
}
