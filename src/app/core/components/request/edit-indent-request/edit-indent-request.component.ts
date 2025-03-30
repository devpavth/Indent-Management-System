import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { Employeedetails } from '../../../models/employee/employeedetails.model';
import { BranchService } from '../../service/Branch/branch.service';
import { Department, Program } from '../../../models/department/department.model';
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
  @Input() indentNumber!: string;
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

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  totalSum: number = 0;
  taxSum: number = 0;
  subtotalSum: number = 0;
  isEditIndentPrdIndex: number | null = null;

  storeProductData: Product[] = [];
  productData: Product[] = [];

  productList: any[] = [];
  _requestIndentDetails: any;
  headerData: any;

  constructor(private fb: FormBuilder) {
    this.editRequestForm = this.fb.group({
      deptId: [],
      programId: [],
      campName: [''],
      priorityType: [],
      requiredDate: [''],
      expenditureId: [],
      requisitioner: [''],
      totalPrice: [],
      notes: [''],
    });

    this.indentProductForm = this.fb.group({
      productId: [],
      headOfAccId: [],
      qty: [0],
      unitPrice: [0],
      gstpercentage: [],
      prdmdlName: [],
      prdbrndName: [],
      headOfAccName: [],
      prdDescription: [],
      prdcatgName: [],
      status: [200],
    });
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
        const qtyList = this.productList.map((prd) => prd.qty);
        const unitPriceList = this.productList.map((prd) => prd.unitPrice);
        const gstpercentageList = this.productList.map((prd) => prd.prdGstPct);

        console.log('qty:', qtyList);

        const gstResults = qtyList.map((qty, index) => {
          return this.sharedService.gstCalculation(
            qty,
            unitPriceList[index],
            gstpercentageList[index],
          );
        });

        console.log('gstResults:', gstResults);
        this.productList = this.productList.map((prd, index) => ({
          ...prd,
          subtotal: prd.qty * prd.unitPrice,
          tax: gstResults[index].gstAmt,
          total: gstResults[index].itemPrice,
        }));

        console.log('existing productList:', this.productList);

        this.calculateSums();
      },
      (error) => {
        console.log('error while fetching indent details:', error);
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

    console.log('productData:', this.productData);

    this.indentProductForm.patchValue({
      qty: 1,
      headOfAccId: product.headOfAccId,
      unitPrice: product.prdPurchasedPrice,
      gstpercentage: product.prdGstPct,
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
      const gstpercentage = parseFloat(val.gstpercentage) || 0;
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
  }

  liveGstCalculation(){
    const qtyList = this.productList.map((prd) => prd.qty);
    const unitPriceList = this.productList.map((prd) => prd.unitPrice);
    const gstpercentageList = this.productList.map((prd) => prd.prdGstPct);

    console.log('qty:', qtyList);

    const gstResults = qtyList.map((qty, index) => {
      return this.sharedService.gstCalculation(
        qty,
        unitPriceList[index],
        gstpercentageList[index],
      );
    });

    console.log('gstResults:', gstResults);
    this.productList = this.productList.map((prd, index) => ({
      ...prd,
      subtotal: prd.qty * prd.unitPrice,
      tax: gstResults[index].gstAmt,
      total: gstResults[index].itemPrice,
    }));
  }

  liveCalulationForDeletion(){
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

    // Update only active products
    this.productList = this.productList.map((prd, index) => {
      if (prd.status === 404) return prd; // Keep deleted products unchanged

      return {
        ...prd,
        subtotal: prd.qty * prd.unitPrice,
        tax: gstResults[index]?.gstAmt ?? 0,
        total: gstResults[index]?.itemPrice ?? 0,
      };
    });
  }

  editUnitPrice(){

    this.liveGstCalculation();
    
    this.calculateSums();
  }

  editQty(){
    this.liveGstCalculation();
    this.calculateSums();
  }

  editIndentProduct(index: number, product: any) {
    this.isEditIndentPrdIndex = index;

    this.indentProductForm.patchValue({
      unitPrice: product?.unitPrice,
      qty: product.qty,
      status: 301,
    });

    this.productList[index] = {
      ...product,
      status: 301,
    };

    console.log('productList in edit product:', this.productList);
    console.log('after edit indentProductForm:', this.indentProductForm.value);
  }

  deleteProduct(index: number, product: any) {
    // this.productList.splice(index, 1);

    console.log("productList before deletion:", this.productList);

    this.toastService.showSuccess('Item Deleted');

    this.productList[index] = {
      ...product,
      status: 404,
    };

    //  this.productList.splice(index, 1);

    console.log("productList after deletion:", this.productList);

    console.log(
      'after delete indentProductForm:',
      this.indentProductForm.value,
    );
    
    this.liveCalulationForDeletion();
    this.calculateSums();
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
        (res) => {
          console.log('successfully updated the indent details:', res);

          this.toastService.showSuccess('Indent Updated Successfully.');
          setTimeout(() => {
            this.route.navigate(['/home/userRequest']);
          }, 3000);
        },
        (error) => {
          console.log('error while updating the indent details:', error);
        },
      );
  }
}
