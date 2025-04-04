import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';
import { RequestService } from '../../../service/Request/request.service';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrl: './adding.component.css',
})
export class AddingComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Output() addedBrand = new EventEmitter<number>();
  @Output() addedCategory = new EventEmitter<number>();
  @Output() addedGroup = new EventEmitter<void>();
  @Input() addData: any;

  toastService = inject(ToastService);

  selectedGroup: number = 0;
  selectedCategory: number = 0;

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
      prdcatgName: ['', [Validators.required,
        Validators.pattern('^[a-zA-Z ]+$')]],
      prdcatgStatus: [200],
    });

    this.BrandForm = this.fb.group({
      catId: [],
      prdbrndName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      ],
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
      this.headofacc = res;
    });
  }

  isProductGroupsValid(): boolean{
    const productGroups = this.GroupForm.get('productGroups') as FormArray;
    return productGroups.controls.every((group) => group.get('prdgrpName')?.value?.trim())
  }

  submitGroup(data: any) {
    console.log(data);

    this.productService.addGroup(data).subscribe(
      (res: any) => {
        console.log(res);
        this.toastService.showSuccess(res.error);
        this.addedGroup.emit();
        setTimeout(() => {
          this.close.emit(false);
        }, 3000);
      },
      (error) => {
        console.log(error);
        this.toastService.showError(error.error);
        if (error.status == 200) {
          // this.close.emit(false);
        }
      },
    );
  }
  onSubmitCat(data: any) {
    console.log(data);

    this.productService.addCat(data).subscribe(
      (res: any) => {
        console.log(res);
        this.toastService.showSuccess(res.error);

        this.selectedGroup = this.CatForm.get('grpId')?.value;
        console.log('selectedGroup:', this.selectedGroup);
        this.addedCategory.emit(Number(this.selectedGroup));

        setTimeout(() => {
          this.close.emit(false);
        }, 3000);
      },
      (error) => {
        console.log(error);
        this.toastService.showError(error.error);
        if (error.status == 200) {
          this.close.emit(false);
        }
      },
    );
  }
  onSubmitBrand(data: any) {
    this.productService.addBrand(data).subscribe(
      (res: any) => {
        console.log(res);
        this.toastService.showSuccess(res.error);

        this.selectedCategory = this.BrandForm.get('catId')?.value;
        console.log('selectedCat:', this.selectedCategory);
        this.addedBrand.emit(Number(this.selectedCategory));

        setTimeout(() => {
          this.close.emit(false);
        }, 3000);
      },
      (error) => {
        console.log(error);
        this.toastService.showError(error.error);
        if (error.status == 200) {
          this.close.emit(false);
        }
      },
    );
  }
}
