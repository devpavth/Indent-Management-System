import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';

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

  GroupForm: FormGroup;
  CatForm: FormGroup;
  BrandForm: FormGroup;
  ngOnInit() {
    console.log(this.addData);
    this.fetchGroupList();
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.GroupForm = this.fb.group({
      prdgrpName: [],
      prdgrpStatus: [200],
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

  submitGroup(data: any) {
    console.log(data);

    this.productService.addGroup(data).subscribe((res) => {
      console.log(res);
    });
  }
  onSubmitCat(data: any) {
    console.log(data);

    this.productService.addCat(data).subscribe((res) => {
      console.log(res);
    });
  }
  onSubmitBrand(data: any) {
    this.productService.addBrand(data).subscribe((res) => {
      console.log(res);
    });
  }
}
