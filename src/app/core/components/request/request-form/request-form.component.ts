import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'], // Fixed typo from `styleUrl` to `styleUrls`
})
export class RequestFormComponent implements OnInit {
  isHeader: boolean = true;
  isProductAdd: boolean = false;

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

  employeeData: any;
  suggestions: any[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private requestService: RequestService,
    private empService: EmployeeServiceService,
  ) {
    this.requestIndentHead = this.fb.group({
      branchCode: [],
      deptId: [],
      programId: [],
      campName: [],
      headOfAccId: [],
      requiredDate: [],
      expenditureId: [],
      requisitioner: [],
      notes: [],
    });
    this.productForm = this.fb.group({
      productId: [],
      qty: [],
      unitPrice: [],
      gstpercentage: [],
      status: [200],
    });
  }

  ngOnInit() {
    this.fetchProgram();
    this.fetchHeadofAcc();
    this.fetchUser();
    this.fetchGroupList();
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
  patchProductData(id: any) {
    let prdList: any[] = this.desList;
    let product = prdList.find((f) => f.productId == id);
    console.log('find', product);
    this.productForm.patchValue({
      productId: product.productId,

      unitPrice: product.prdPurchasedPrice,
      gstpercentage: product.prdGstPct,
    });
  }
  onSelectionChanged(selectedValue: any) {
    console.log('Selected value:', selectedValue);
    // Implement your logic here
  }
}
