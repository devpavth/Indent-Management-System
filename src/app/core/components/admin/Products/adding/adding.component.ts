import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';
import { RequestService } from '../../../service/Request/request.service';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrl: './adding.component.css',
})
export class AddingComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() addData: any;

  groupList: any;
  catList: any;
  headofacc: any;
  GroupForm: FormGroup;
  CatForm: FormGroup;
  BrandForm: FormGroup;
  ngOnInit() {
    console.log(this.addData);
    this.fetchGroupList();
    this.fetchHeadofAcc();
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.GroupForm = this.fb.group({
      headOfAccId: [],
      productGroups: this.fb.array([this.groupConrtols()]),
    });

    this.CatForm = this.fb.group({
      grpId: [],
      prdcatgName: [],
      prdcatgStatus: [200],
    });

    this.BrandForm = this.fb.group({
      catId: [],
      prdbrndName: [],
      prdbrndStatus: [200],
    });
  }
  groupConrtols() {
    return this.fb.group({
      prdgrpName: [''],
      prdgrpStatus: [200],
    });
  }
  get groupData() {
    return this.GroupForm.get('productGroups') as FormArray;
  }
  pushGroup() {
    this.groupData.push(this.groupConrtols());
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
  fetchHeadofAcc() {
    this.productService.getHeadofAccList().subscribe((res) => {
      console.log(res);
      this.headofacc = Object.entries(res).map(([id, value]) => ({
        id,
        value,
      }));
    });
  }

  submitGroup(data: any) {
    console.log(data);

    this.productService.addGroup(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this.close.emit(false);
        }
      },
    );
  }
  onSubmitCat(data: any) {
    console.log(data);

    this.productService.addCat(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this.close.emit(false);
        }
      },
    );
  }
  onSubmitBrand(data: any) {
    this.productService.addBrand(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this.close.emit(false);
        }
      },
    );
  }
}
