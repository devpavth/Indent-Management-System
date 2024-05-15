import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly productHttp: HttpClient) {}

  private _refrechData = new Subject<void>();
  get refrechData() {
    return this._refrechData;
  }

  addProduct(productData: any) {
    return this.productHttp.post(environment.addProduct, productData);
  }

  getAllProduct(sno: any) {
    return this.productHttp.get(environment.getAllProduct);
  }

  getProductDetails(productCode: any) {
    return this.productHttp.get(environment.getProductDetails + productCode);
  }

  updateProduct(productData: any) {
    return this.productHttp.put(environment.updateProduct, productData).pipe(
      tap(() => {
        this.refrechData.next();
      }),
    );
  }
  deleteProduct(deleteItem: any) {
    return this.productHttp
      .post(environment.deleteProduct + deleteItem, deleteItem)
      .pipe(
        tap(() => {
          this.refrechData.next();
        }),
      );
  }

  getRequestPoduct() {
    return this.productHttp.get(environment.requestGetProductDetails);
  }

  getRequestBrand(product: any) {
    return this.productHttp.get(
      environment.requestGetProductDetails + `/${product}`,
    );
  }
  getRequestModel(product: any, brand: any) {
    return this.productHttp.get(
      environment.requestGetProductDetails + `/${product}` + `/${brand}`,
    );
  }

  getRequestDescription(product: any, brand: any, model: any) {
    return this.productHttp.get(
      environment.requestGetProductDetails +
        `/${product}` +
        `/${brand}` +
        `/${model}`,
    );
  }
  getproduct(data: any) {
    return this.productHttp.get(environment.getProductDetails);
  }
  addOtherProduct(otherProduct: any) {
    return this.productHttp.post(environment.addOtherProduct, otherProduct);
  }
  getAllOtherProduct() {
    return this.productHttp.get(environment.getAllOtherProduct);
  }
  updateOtherProduct(data: any) {
    return this.productHttp.post(environment.UpdateOtherProduct, data);
  }
}
