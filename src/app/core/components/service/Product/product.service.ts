import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private productHttp: HttpClient) {}

  addGroup(data: any) {
    return this.productHttp.post(environment.addGroup, data);
  }
  groupList() {
    return this.productHttp.get(environment.groupList);
  }
  addCat(data: any) {
    return this.productHttp.post(environment.addCat + data.grpId, data);
  }
  catagoriesList(Id: any) {
    return this.productHttp.get(environment.catList + Id);
  }
  addBrand(data: any) {
    return this.productHttp.post(environment.addBrand + data.catId, data);
  }
  brandList(catId: any) {
    return this.productHttp.get(environment.brandList + catId);
  }
  postProduct(data: any) {
    return this.productHttp.post(
      environment.postProduct + data.prdBrndId,
      data,
    );
  }
  getAllProduct() {
    return this.productHttp.get(environment.getAllProduct);
  }
  deleteProduct(id: any) {
    console.log("environment.deleteProduct + id:", environment.deleteProduct + id);
    return this.productHttp.delete(environment.deleteProduct + id);
  }
  getProductByCode(id: any) {
    return this.productHttp.get(environment.getProductByCode + id);
  }
  addInward(data: any) {
    return this.productHttp.post(environment.inward, data);
  }
  getStockDetails(id: any) {
    return this.productHttp.get(environment.getStockDetails + id);
  }
  productTransaction(id: any) {
    return this.productHttp.get(environment.productTransaction + id);
  }
  getModelList(id: any) {
    return this.productHttp.get(environment.modelList + id);
  }
  getProductDes(brdId: string, mName: string) {
    return this.productHttp.get(environment.desList + brdId + '/' + mName);
  }
  getHeadofAccList() {
    return this.productHttp.get(environment.headofaccountlist);
  }
  addOtherProduct(data: any) {
    return this.productHttp.post(environment.otherProduct, data);
  }
  getStockReport(date: any) {
    let dateRange = new HttpParams();
    dateRange = dateRange.append('startDate', date.from);

    dateRange = dateRange.append('endDate', date.to);
    return this.productHttp.get(environment.productReport, {
      params: dateRange,
    });
  }

  addHeadOfAcc(data: any) {
    return this.productHttp.post(environment.addHeadOfAcc, data);
  }

  fetchLiveProductDetails(params: {[key: string]: string}){
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });

    console.log("httpParams:", httpParams.toString());

    return this.productHttp.get(environment.fetchLiveProductDetails, {params: httpParams});
  }

  fetchLiveVendorDetails(params: {[key: string]: string}){
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });

    console.log("httpParams:", httpParams.toString());

    return this.productHttp.get(environment.fetchLiveVendorDetails, {params: httpParams});
  }
}
