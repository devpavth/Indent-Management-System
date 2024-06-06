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
    return this.http.get(environment.getYourReq + '/' + data);
  }
  viewReq(data: any): Observable<any> {
    return this.http.get(environment.viewYourReq + data);
  }
  reqProduct(data: any) {
    return this.http.get(environment.reqProduct + data);
  }
  branchRequestList(status: any, sno: any) {
    return this.http.get(environment.branchApprovelList + sno + '/' + status);
  }
  branchApprovel(data: any) {
    return this.http.post(environment.branchApprovel + data, data);
  }
  branchReject(sno: any, data: any) {
    let mesgParams = new HttpParams();
    mesgParams = mesgParams.append('commends', data);
    return this.http.post(environment.branchRejected + sno, data, {
      params: mesgParams,
    });
  }
  adminRequestList(status: any, branchId: any) {
    return this.http.get(
      environment.adminAprovalList + branchId + '/' + status,
    );
  }
  adminApprovel(data: any) {
    return this.http.post(environment.adminAprovel + data, data);
  }
  adminReject(sno: any, data: any) {
    let mesgParams = new HttpParams();
    mesgParams = mesgParams.append('commends', data);
    return this.http.post(environment.adminRejected + sno, data, {
      params: mesgParams,
    });
  }
  finRequestList(data: any): Observable<any> {
    return this.http.get(environment.finRequestList + data);
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
    commendParams = commendParams.append('commends', data);
    commendParams = commendParams.append(
      'notes',
      'ethula Onnu Illa kizha pottudu',
    );
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
}
