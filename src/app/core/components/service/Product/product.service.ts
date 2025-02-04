import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Vendor } from '../../../models/vendor/vendor.type';

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

  getAllProduct(offSet: number, pageSize: number) {
    let params = new HttpParams()
    .set('offSet', offSet.toString())
    .set('pageSize', pageSize.toString())

    return this.productHttp.get(environment.getAllProduct, {params});
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

  saveOutward(data: any){
    return this.productHttp.post(environment.saveOutward, data);
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

  fetchLiveVendorDetails(params: {[key: string]: string}): Observable<Vendor[]>{
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });

    console.log("httpParams:", httpParams.toString());

    return this.productHttp.get<Vendor[]>(environment.fetchLiveVendorDetails, {params: httpParams});
  }

  fetchOtherProductDetails(){
    return this.productHttp.get(environment.fetchOtherProductDetails);
  }

  fetchInwardForBranch(id: any){
    console.log("environment.fetchInwardForBranch + id:", environment.fetchInwardForBranch + id);
    return this.productHttp.get(environment.fetchInwardForBranch + id);
  }

  confirmInward(code: any){
    return this.productHttp.post(environment.confirmInward + code, '');
  }

  updateProductDetails(productId: any, data: any){
    return this.productHttp.put(environment.updateProductDetails + productId, data);
  }

  updateOtherProductDetails(productId: any, data: any){
    return this.productHttp.put(environment.updateOtherProductDetails + productId, data);
  }
}
