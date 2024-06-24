import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.css',
})
export class RequestFormComponent implements OnInit {
  //pipe declaration

  // UI RequestIdent name declaration
  _totalPrice: number = 0;

  _rItemList: any[] = []; //used for addinf request items to array

  _productName: any;

  _brandName: any;
  _model: any;
  _description: any;
  _hsn: any;
  _gst: any;
  _product: any;
  _indentId: any;
  requestProduct: FormGroup;
  //for visiable content declaration here

  visiable: boolean = false;
  emptyVisiable: boolean = true;
  successToast: boolean = false;
  isSuccess: boolean = false;
  showRequisitioner: boolean = false;
  isRequisitioner: boolean = true;
  isOther: boolean = false;
  isHeader: boolean = true;
  isProductAdd: boolean = false;

  reqName: any;

  //new request indent declare
  requestIndentHead: FormGroup;
  programList: any;
  headofacc: any;

  employeeData: any;

  constructor(
    private readonly ProductService: ProductService,
    private fb: FormBuilder,
    private requestService: RequestService,
    private shared: SharedServiceService,
  ) {
    this.requestIndentHead = this.fb.group({});
    this.requestProduct = this.fb.group({
      itemName: [],
      brandName: [],
      model: [],
      qty: [],
      unitPrice: [],
      itemPrice: [],
      hsnCode: [],

      description: [],
    });
  }

  ngOnInit() {
    this.fetchProgram();
    this.fetchHeadofAcc();
    this.employeeData = this.shared.getData();
    console.log('hello', this.employeeData);
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

  closeOtherProduct(data: any) {
    this.isOther = data;
  }

  getOtherProduct(data: any) {
    console.log(data);
    this._product.configuration = data.configuration;
    console.log(this._product.configuration);

    this._rItemList.push(data);
    if (this._rItemList.length > 0) {
      this.visiable = true;
      this.emptyVisiable = false;
    }

    this.emptyVisiable = false;
    this.visiable = true;
  }
}
