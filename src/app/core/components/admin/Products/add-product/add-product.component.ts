import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  addingData: any;

  isCloseAdding: boolean = false;
  loading: boolean = false;
  isPriceLabel: boolean = false;

  groupList: any;
  catList: any;
  brandList: any;
  gst: any = [0, 5, 12, 18];
  units: { id: number; name: string; term: string }[] = [
    { id: 1, name: 'Kg', term: 'Kilograms' },
    { id: 2, name: 'L', term: 'Liters' },
    { id: 3, name: 'M', term: 'Meter' },
    { id: 4, name: 'Unit', term: 'Piece' },
    { id: 5, name: 'Lt', term: 'Liters' },
    { id: 6, name: 'Feet', term: 'Feet' },
    { id: 7, name: 'Roll', term: 'Roll' },
    { id: 8, name: 'Dcm', term: 'Decimeters' },
    { id: 9, name: 'Bag', term: 'Bag' },
    { id: 10, name: 'Pair', term: 'Pair' },
    { id: 11, name: 'Tin', term: 'Tin' },
    { id: 12, name: 'Sheet', term: 'Sheet' },
    { id: 13, name: 'Ream', term: 'Ream' },
    { id: 14, name: 'No', term: 'Number' },
    { id: 15, name: 'Meter', term: 'Meter' },
    { id: 200, name: 'Box', term: 'Box' },
  ];

  private route = inject(Router);

  ProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.ProductForm = this.fb.group({
      prdGrpId: ['', [Validators.required]],
      prdCatgId: [],
      prdBrndId: [],
      prdmdlName: [],
      prdDescription: [],
      prdUnit: [],
      prdHsnCode: [],
      prdPurchasedPrice: [],
      prdGstPct: [],
      prdMinQty: [],
      prdStatus: [200],
    });
  }
  ngOnInit(): void {
    this.fetchGroupList();
  }

  addingAction(check: number) {
    this.isCloseAdding = true;
    if (check === 1) {
      this.addingData = { title: 'Add Group', Adding: 1 };
      console.log(this.addingData);
    }
    if (check === 2) {
      this.addingData = { title: 'Add Category', Adding: 2 };
      console.log(this.addingData);
    }
    if (check === 3) {
      this.addingData = { title: 'Add Brand', Adding: 3 };
      console.log(this.addingData);
    }
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

  selectedUnitOfMaterial(event: Event){
    const inputElement = event.target as HTMLSelectElement;
    const inputValue = Number(inputElement.value);
    console.log("inputValue:", inputValue);

    const boxUnitId = this.units.find(unit => unit.id === 200);
    console.log("unitId:", boxUnitId);

    if(inputValue === boxUnitId?.id){
      this.isPriceLabel = true;
    }else{
      this.isPriceLabel = false;
    }
  }

  onSubmit(data: any) {
    console.log('product data:', data);

    this.loading = true;
    this.productService.postProduct(data).subscribe(
      (res) => {
        console.log('successfully product data saved:', res);
        this.ProductForm.reset();
        this.ProductForm.get('prdStatus')?.patchValue(200);
        this.route.navigate(['home/productList']);
        this.loading = false;
      },
      (error) => {
        console.log('error while saving data:', error);
        this.loading = false;
        if (error.status == 200) {
          this.loading = false;
        }
      },
    );
  }
  closeAdding(action: boolean) {
    this.isCloseAdding = action;
    this.fetchGroupList();
    this.ProductForm.reset();
  }
}
