import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private readonly http: HttpClient) {}
  postRequestIndent(req: any) {
    return this.http.post(environment.postRequestIndent, req);
  }
  getYourReq(data: any) {
    return this.http.get(environment.getYourReq);
  }
  viewReq(data: any): Observable<any> {
    return this.http.get(environment.viewYourReq + data);
  }
  reqProduct(data: any) {
    return this.http.get(environment.reqProduct + data);
  }

  branchRequestList(id: any, data?: string) {
    let params = new HttpParams();

    if(data){
      params = params.append('startDate', data);
    }

    return this.http.get(environment.branchApprovelList + id, {
      params: params,
    });
  }

  // fetchProgramManagerRequest(id: any, data?: string){
  //   let mesgParams = new HttpParams();

  //   if(data){
  //     mesgParams = mesgParams.append('startDate', data);
  //   }

  //   return this.http.get(environment.fetchProgramManagerRequest + id, {
  //     params: mesgParams,
  //   });
  // }

  branchApprovel(data: any) {
    return this.http.post(environment.branchApprovel + data, data);
  }
  branchReject(sno: any, data: any) {
    let mesgParams = new HttpParams();
    mesgParams = mesgParams.append('comments', data);
    return this.http.post(environment.branchRejected + sno, data, {
      params: mesgParams,
    });
  }
  adminRequestList(status: any, data?: string) {
    let params = new HttpParams();

    if(data){
      params = params.append('startDate', data);
    }

    return this.http.get(environment.adminAprovalList + status, {
      params: params,
    });
  }
  adminApprovel(data: any) {
    return this.http.post(environment.adminAprovel + data, data);
  }
  adminReject(sno: any, data: any) {
    let mesgParams = new HttpParams();
    mesgParams = mesgParams.append('comments', data);
    return this.http.post(environment.adminRejected + sno, data, {
      params: mesgParams,
    });
  }
  finRequestList(status: any, data?: string): Observable<any> {
    let params = new HttpParams();

    if(data){
      params = params.append('startDate', data);
    }

    return this.http.get(environment.finRequestList + status, {
      params: params
    });
  }
  commands() {
    return this.http.get(environment.commend);
  }
  updateRequest(id: any, data: any) {
    return this.http.post(environment.updateRequestList + id, data);
  }
  finDonorAssign(Id: string, data: any) {
    return this.http.post(environment.finSubmite + Id, data);
  }
  commend(id: any, data: any, check: number) {
    let commendParams = new HttpParams();
    commendParams = commendParams.append('comments', data.toString());
    console.log("typeof data:", typeof data);
    console.log("commendParams:", commendParams);
  
    if (check === 1) {
      return this.http.post(
        environment.finHolding + id,
        {},
        { params: commendParams },
      );
    }
    if (check === 2) {
      return this.http.post(
        environment.finReject + id,
        {},
        { params: commendParams },
      );
    }
    return null;
  }

  uploadPdf(data: any, fileName: any) {
    let name = new HttpParams();
    name = name.append('selectedQuote', fileName);
    return this.http.post(environment.comparisonPdf, data, { params: name });
  }
  //new request indent api function
  getProgramList() {
    return this.http.get(environment.programlist);
  }

  //new request indent

  postIndent(data: any) {
    return this.http.post(environment.postIndent, data);
  }

  getBranchDetails(){
    console.log("Test");
    console.log("Sending request.");
    console.log('Get URL:', environment.confirmBranchDetails);
    return this.http.get(environment.confirmBranchDetails);
  }

  getConfirmOtp(){
    console.log("Sending request for OTP.");
    console.log('Get URL:', environment.confirmOtp);
    return this.http.get(environment.confirmOtp);
  }

  fetchProgramManagerRequest(id: any, data?: string){
    let mesgParams = new HttpParams();

    if(data){
      mesgParams = mesgParams.append('startDate', data);
    }

    return this.http.get(environment.fetchProgramManagerRequest + id, {
      params: mesgParams,
    });
  }

  programManagerApproval(id: any){
    return this.http.post(environment.programManagerApproval + id, '');
  }

  programManagerRejection(sno: any, data: any){
    let mesgParams = new HttpParams();
    mesgParams = mesgParams.append('comments', data);
    return this.http.post(environment.programManagerRejected + sno, data, {
      params: mesgParams,
    });
  }
}
