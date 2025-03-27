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

@Component({
  selector: 'app-edit-indent-request',
  templateUrl: './edit-indent-request.component.html',
  styleUrl: './edit-indent-request.component.css',
})
export class EditIndentRequestComponent {
  @Input() IndentID: string = '';
  @Output() closeView = new EventEmitter<boolean>();

  editRequestForm: FormGroup;
  indentProductForm: FormGroup;

  empService = inject(EmployeeServiceService);
  branchService = inject(BranchService);
  toastService = inject(ToastService);
  productService = inject(ProductService);

  employeeDetails: Employeedetails | undefined;
  departmentList: Department[] = [];
  programList: Program[] = [];

  isEditHeader: boolean = false;
  isOtherProduct: boolean = false;
  isProductSelected: boolean = false;
  noResults: boolean = false;

  storeProductData: Product[] = [];
  productData: Product[] = [];

  date: Date = new Date();
  private intervalId: ReturnType<typeof setInterval> | null = null;

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
      qty: [],
      unitPrice: [],
      status: [200],
    });
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.date = new Date();
    }, 1000);

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

    this.fetchEmployeeDetails();
    this.fetchDepartmentList();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
    this.isEditHeader = true;

    this.editRequestForm.disable();

    this.toastService.showSuccess('Header Added Successfully');
  }

  onEditHeader() {
    this.isEditHeader = false;

    this.editRequestForm.enable();
  }

  toggleOtherProduct(data: boolean) {
    console.log('other product:', data);
    this.isOtherProduct = data;
  }

  onSelectProduct(product: Product){
    console.log('after selecting the product from the list', product);
    this.isProductSelected = true;
    this.productData = [product];

    console.log('productData:', this.productData);

    this.indentProductForm.patchValue({
      headOfAccId: product.headOfAccId
    });

    this.storeProductData = [];
  }
}
