import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { Employeedetails } from '../../../models/employee/employeedetails.model';
import { BranchService } from '../../service/Branch/branch.service';
import {
  Department,
  Program,
} from '../../../models/department/department.model';
import { ToastService } from '../../service/toast/toast.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { Product } from '../../../models/product/product.model';
import { HttpParams } from '@angular/common/http';
import { ProductService } from '../../service/Product/product.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { RequestService } from '../../service/Request/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-indent-request',
  templateUrl: './edit-indent-request.component.html',
  styleUrl: './edit-indent-request.component.css',
})
export class EditIndentRequestComponent {
  @Input() IndentID!: number;
  @Output() closeView = new EventEmitter<boolean>();

  editRequestForm: FormGroup;
  indentProductForm: FormGroup;

  empService = inject(EmployeeServiceService);
  branchService = inject(BranchService);
  toastService = inject(ToastService);
  productService = inject(ProductService);
  sharedService = inject(SharedServiceService);
  requestService = inject(RequestService);
  route = inject(Router);

  employeeDetails: Employeedetails | undefined;
  departmentList: Department[] = [];
  programList: Program[] = [];

  isEditHeader: boolean = false;
  isOtherProduct: boolean = false;
  isProductSelected: boolean = false;
  noResults: boolean = false;
  isDelete: boolean = false;
  loading: boolean = true;
  isEnableSaveBtn: boolean = false;
  isEnableAddHeader: boolean = false;

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  totalSum: number = 0;
  taxSum: number = 0;
  subtotalSum: number = 0;
  isEditIndentPrdIndex: number | null = null;
  originalUnitPrice: number = 0;
  originalQty: number = 0;

  storeProductData: Product[] = [];
  productData: Product[] = [];

  productList: any[] = [];
  _requestIndentDetails: any;
  headerData: any;
  deleteProductItem: {
    title: string;
    action: number;
    index: number;
    product: {};
  } = {
    title: '',
    action: 0,
    index: 0,
    product: {},
  };

  date = new Date();
  currentDate: string | undefined;

  constructor(private fb: FormBuilder) {
    this.editRequestForm = this.fb.group({
      deptId: [null, Validators.required],
      programId: [null, Validators.required],
      campName: ['', Validators.required],
      priorityType: [Validators.required],
      requiredDate: ['', Validators.required],
      expenditureId: [null, Validators.required],
      requisitioner: ['', Validators.required],
      totalPrice: [],
      notes: [''],
    });

    this.indentProductForm = this.fb.group({
      productId: [],
      headOfAccId: [],
      qty: [0],
      unitPrice: [0],
      prdGstPct: [],
      prdmdlName: [],
      prdbrndName: [],
      headOfAccName: [],
      prdDescription: [],
      prdcatgName: [],
      status: [200],
    });

    this.currentDate = this.date.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.indentProductForm
      .get('productId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          console.log(`Product Name Changed for Index:`, searchTerm);
          if (this.isProductSelected) {
            this.isProductSelected = false;

            return of([]);
          }
          this.noResults = false;
          this.storeProductData = [];
          if (
            !searchTerm.trim() ||
            !isNaN(searchTerm) ||
            searchTerm.length < 3
          ) {
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

        this.isProductSelected = false;
      });

    this.editRequestForm.disable();

    this.fetchIndentRequestDetails(this.IndentID);
    this.fetchEmployeeDetails();
    this.fetchDepartmentList();
    this.onChanges();
  }

  fetchIndentRequestDetails(indentID: number) {
    this.requestService.viewReq(indentID).subscribe(
      (res) => {
        console.log('fetching indent request details:', res);
        this._requestIndentDetails = res;

        this.loading = false;

        this.editRequestForm.patchValue({
          campName: this._requestIndentDetails.indentHeaders.campName,
          requiredDate: this._requestIndentDetails.indentHeaders.requiredDate,
          requisitioner: this._requestIndentDetails.indentHeaders.requisitioner,
          totalPrice: this._requestIndentDetails.indentHeaders.totalPrice,
          notes: this._requestIndentDetails.indentHeaders.notes,
          expenditureId: String(
            this._requestIndentDetails.indentHeaders.expenditureId,
          ),
          deptId: this._requestIndentDetails.indentBranch?.deptId,
          programId: this._requestIndentDetails.indentHeaders?.programId,
          priorityType: String(
            this._requestIndentDetails.indentHeaders.priorityType,
          ),
        });

        if (this._requestIndentDetails.indentBranch.deptId) {
          this.fetchProgram(this._requestIndentDetails.indentBranch.deptId);
        }

        this.headerData = this.editRequestForm.value;

        console.log(this._requestIndentDetails.indentHeaders?.programId);
        console.log(this._requestIndentDetails.indentHeaders.priorityType);

        this.productList = this._requestIndentDetails.productDetails;
        const unitPriceList = this.productList.map((prd) => prd.unitPrice);
        const qtyList = this.productList.map((prd) => prd.qty);

        unitPriceList.map((price, index) => {
          this.originalUnitPrice = price;
          this.originalQty = qtyList[index];

          console.log('originalQty:', this.originalQty);
          console.log('originalPrice:', this.originalUnitPrice);
        });

        this.liveCalulationForDeletion();

        console.log('existing productList:', this.productList);

        this.calculateSums();
      },
      (error) => {
        console.log('error while fetching indent details:', error);
        this.loading = false;
      },
    );
  }

  fetchEmployeeDetails() {
    const userId = sessionStorage.getItem('userId');

    this.empService.getEmployeeDetails(userId).subscribe(
      (res) => {
        console.log('fetching employee details:', res);
        this.employeeDetails = res;
      },
      (error) => {
        console.log('error while fetching employee details:', error);
      },
    );
  }

  fetchDepartmentList() {
    this.branchService.getAllDepartments().subscribe(
      (res: Department[]) => {
        console.log('fetching department details:', res);
        this.departmentList = res;
      },
      (error) => {
        console.log('error while fetching department details:', error);
      },
    );
  }

  fetchProgram(deptId: number) {
    this.branchService.getActiveProgram(deptId).subscribe(
      (res: any) => {
        console.log('fetching program details:', res);
        this.programList = res.departProgram;

        if(this.programList.length > 0){
          this.editRequestForm.get('programId')?.setValue(this.programList[0].programId);
          this.isEnableAddHeader = true;
        }

        if(this.programList.length === 0){
          this.isEnableAddHeader = false;
        }
      },
      (error) => {
        console.log('error while fetching program details:', error);
      },
    );
  }

  onSubmitHeader(headerData: any) {
    console.log('headerData:', headerData);

    this.editRequestForm.disable();

    this.toastService.showSuccess('Header Added Successfully');

    this.headerData = headerData;
    // this.isEnableSaveBtn = true;
  }

  onEditHeader() {
    this.isEditHeader = true;

    this.editRequestForm.enable();
  }

  toggleOtherProduct(data: boolean) {
    console.log('other product:', data);
    this.isOtherProduct = data;
  }

  onSelectProduct(product: Product) {
    console.log('after selecting the product from the list', product);
    this.isProductSelected = true;
    this.productData = [product];

    const duplicateProducts = this.productList.find(
      (prd) => prd.productId === product.productId,
    );

    if (duplicateProducts) {
      this.toastService.showError('Product Already Exists in the Cart');
      this.isProductSelected = false;
      this.productData = [];
      this.storeProductData = [];
      return;
    }

    console.log('productData:', this.productData);

    this.indentProductForm.patchValue({
      qty: 1,
      headOfAccId: product.headOfAccId,
      unitPrice: product.prdPurchasedPrice,
      prdGstPct: product.prdGstPct,
      prdmdlName: product.prdmdlName,
      prdbrndName: product.prdbrndName,
      headOfAccName: product.headOfAccName,
      prdDescription: product.prdDescription,
      prdcatgName: product.prdcatgName,
    });

    this.storeProductData = [];
  }

  onChanges() {
    this.indentProductForm.valueChanges.subscribe((val) => {
      const unitPrice = parseFloat(val.unitPrice) || 0;
      const qty = parseInt(val.qty) || 0;
      const gstpercentage = parseFloat(val.prdGstPct) || 0;
      let gst = this.sharedService.gstCalculation(
        qty,
        unitPrice,
        gstpercentage,
      );
      console.log('gst from service:', gst);

      this.subtotal = unitPrice * qty;
      this.tax = gst.gstAmt;
      this.total = gst.itemPrice;
    });
  }

  addToCartProduct(product: any) {
    console.log('product:', product);

    this.toastService.showSuccess('Item Added');

    this.isEnableSaveBtn = true;

    const existingIndex = this.productList.findIndex(
      (p) => p.productId === product.productId,
    );

    console.log('existingIndex:', existingIndex);
    console.log(
      'productList in existingIndex:',
      this.productList[existingIndex]?.qty,
    );

    if (existingIndex !== -1) {
      console.log('calling if condition in existingIndex');
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
        id: 0,
        status: 200,
      };

      this.productList.push(list);
    }

    console.log('productList:', this.productList);

    this.calculateSums();
    this.indentProductForm.reset();
  }

  liveCalulationForDeletion() {
    const activeProducts = this.productList.filter((prd) => prd.status !== 404);

    const qtyList = activeProducts.map((prd) => prd.qty);
    const unitPriceList = activeProducts.map((prd) => prd.unitPrice);
    const gstpercentageList = activeProducts.map((prd) => prd.prdGstPct);

    console.log('qty:', qtyList);

    const gstResults = qtyList.map((qty, index) => {
      return this.sharedService.gstCalculation(
        qty,
        unitPriceList[index],
        gstpercentageList[index],
      );
    });

    console.log('gstResults:', gstResults);

    let activeIndex = 0;
    this.productList = this.productList.map((prd) => {
      if (prd.status === 404) return prd;

      const updatedProduct = {
        ...prd,
        subtotal: prd.qty * prd.unitPrice,
        tax: gstResults[activeIndex].gstAmt ?? 0,
        total: gstResults[activeIndex].itemPrice ?? 0,
      };

      activeIndex++;
      console.log('updatedProduct:', updatedProduct);
      return updatedProduct;
    });

    console.log('Updated productList:', this.productList);
  }

  trackByProduct(index: number, product: any): number {
    return product.id;
  }

  editUnitPrice(index: number, product: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = Number(inputElement.value);

    console.log('inputvalue', inputValue);
    console.log('existing price:', this.productList[index].unitPrice);
    console.log('check index id:', this.productList[index].id);

    if (inputValue <= 0 || isNaN(inputValue)) {
      inputElement.value = '';
      this.isEnableSaveBtn = false;
      return;
    }

    if (
      inputValue === this.originalUnitPrice ||
      this.productList[index].id === 0
    ) {
      this.productList[index].status = 200;
      this.isEnableSaveBtn = false;
    } else {
      this.productList[index].status = 301;
      this.isEnableSaveBtn = true;
    }

    this.indentProductForm.patchValue({
      unitPrice: product?.unitPrice,
      qty: product.qty,
      status: 301,
    });

    this.liveCalulationForDeletion();

    this.calculateSums();
  }

  editQty(index: number, product: any, event: Event) {
    const inputElemet = event.target as HTMLInputElement;
    const inputValue = Number(inputElemet.value);

    console.log('inputValue:', inputValue);

    if (inputValue <= 0 || isNaN(inputValue)) {
      inputElemet.value = '';
      this.isEnableSaveBtn = false;
      return;
    }

    console.log('inputValue after:', inputValue);

    if (inputValue === this.originalQty || this.productList[index].id === 0) {
      this.productList[index].status = 200;
      this.isEnableSaveBtn = false;
    } else {
      this.productList[index].status = 301;
      this.isEnableSaveBtn = true;
    }

    this.indentProductForm.patchValue({
      unitPrice: product?.unitPrice,
      qty: product.qty,
      status: 301,
    });

    this.liveCalulationForDeletion();

    this.calculateSums();
  }

  editIndentProduct(index: number, product: any) {
    if (this.isEditIndentPrdIndex !== null) {
      const activeProduct = this.productList[this.isEditIndentPrdIndex];
      if (
        !activeProduct.qty ||
        activeProduct.qty <= 0 ||
        !activeProduct.unitPrice ||
        activeProduct.unitPrice <= 0
      ) {
        return;
      }
    }

    this.isEditIndentPrdIndex = index;

    console.log('originalPrice:', this.originalUnitPrice);
    console.log('originalQty:', this.originalQty);

    console.log('productList in edit product:', this.productList);
    console.log('after edit indentProductForm:', this.indentProductForm.value);
  }

  resetEditIndentIndex(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = Number(inputElement.value);

    if (inputElement.value.trim() === '' || inputValue === 0) {
      this.isEditIndentPrdIndex = index;
    } else {
      this.isEditIndentPrdIndex = null;
    }
  }

  toggledelete(check: number, isView: boolean, index: number, product: any) {
    this.isDelete = isView;
    if (check === 1) {
      console.log('if condition');
      this.deleteProductItem = {
        title: 'Product',
        action: 6,
        index: index,
        product: product,
      };

      console.log('deleteProductItem:', this.deleteProductItem);
    } else {
      console.log('else condition');
      this.isDelete = isView;
    }
  }

  deleteProduct(index: number, product: any) {
    // this.productList.splice(index, 1);

    console.log('productList before deletion:', this.productList);

    this.toastService.showSuccess('Item Deleted');

    this.productList[index] = {
      ...product,
      status: 404,
    };

    this.isEnableSaveBtn = true;

    console.log(
      'current product status in productList:',
      this.productList[index].status,
    );

    if (
      this.productList[index].id === 0 &&
      this.productList[index].status === 404
    ) {
      this.productList = this.productList.filter((prd) => prd.status !== 404);
    }

    console.log('productList after deletion:', this.productList);

    console.log(
      'after delete indentProductForm:',
      this.indentProductForm.value,
    );

    this.liveCalulationForDeletion();
    this.calculateSums();
  }

  calculateSums() {
    const activeProducts = this.productList.filter((prd) => prd.status !== 404);

    this.totalSum = activeProducts.reduce(
      (sum, product) => sum + product.total,
      0,
    );

    this.taxSum = activeProducts.reduce((sum, product) => sum + product.tax, 0);

    this.subtotalSum = activeProducts.reduce(
      (sum, product) => sum + product.subtotal,
      0,
    );

    console.log('Updated Totals:', {
      totalSum: this.totalSum,
      taxSum: this.taxSum,
      subtotalSum: this.subtotalSum,
    });
  }

  updateIndentDetails() {
    let indent = {
      ...this.headerData,
      totalPrice: this.totalSum.toFixed(2),
      productDetails: this.productList,
    };

    console.log('update indent data:', indent);

    this.requestService
      .updateIndentRequestDetails(this.IndentID, indent)
      .subscribe(
        (res: any) => {
          console.log('successfully updated the indent details:', res);

          this.toastService.showSuccess(res.errorMessege);
          setTimeout(() => {
            this.closeView.emit(false);
            this.route.navigate([]);
          }, 3000);
        },
        (error) => {
          console.log('error while updating the indent details:', error);
        },
      );
  }
}
