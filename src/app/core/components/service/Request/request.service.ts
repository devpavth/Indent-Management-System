import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { debounceTime, Observable, Subject } from 'rxjs';
import { QuoteComparison } from '../../../models/quoteComparison/quote-comparison.model';
import { Prefix } from '../../../models/prefix/prefix.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private searchSubject = new Subject<string>();

  constructor(private readonly http: HttpClient) {}
  postRequestIndent(req: any) {
    return this.http.post(environment.postRequestIndent, req);
  }
  getUserReq(selectedDate: string | undefined) {
    return this.http.get(environment.getYourReq + `?startDate=${selectedDate}`);
  }
  viewReq(data: any): Observable<any> {
    return this.http.get(environment.viewYourReq + data);
  }
  reqProduct(data: any) {
    return this.http.get(environment.reqProduct + data);
  }

  branchRequestList(id: any, data?: string) {
    let params = new HttpParams();

    if (data) {
      params = params.append('startDate', data);
    }

    return this.http.get(environment.branchApprovelList + id, {
      params: params,
    });
  }

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

    if (data) {
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

    if (data) {
      params = params.append('startDate', data);
    }

    return this.http.get(environment.finRequestList + status, {
      params: params,
    });
  }
  commands() {
    return this.http.get(environment.commend);
  }
  updateRequest(id: any, data: any) {
    return this.http.post(environment.updateRequestList + id, data);
  }

  finDonorAssign(Id: any, data: any) {
    return this.http.post(environment.finSubmite + Id, data);
  }

  commend(id: any, data: any, check: number) {
    let commendParams = new HttpParams();
    commendParams = commendParams.append('comments', data.toString());
    console.log('typeof data:', typeof data);
    console.log('commendParams:', commendParams);

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

  uploadPdf(data: any, files: any) {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    files.forEach((file: string | Blob, index: any) => {
      formData.append('files', file);
    });

    return this.http.post(environment.comparisonPdf, formData);
  }

  verifyQuoteComparisonHeadOfAcc(sno: number | undefined) {
    return this.http.get(environment.quoteHeadOfAccVerification + sno);
  }

  //new request indent api function
  getProgramList() {
    return this.http.get(environment.programlist);
  }

  //new request indent

  postIndent(data: any) {
    return this.http.post(environment.postIndent, data);
  }

  getBranchDetails() {
    console.log('Test');
    console.log('Sending request.');
    console.log('Get URL:', environment.confirmBranchDetails);
    return this.http.get(environment.confirmBranchDetails);
  }

  getConfirmOtp() {
    console.log('Sending request for OTP.');
    console.log('Get URL:', environment.confirmOtp);
    return this.http.get(environment.confirmOtp);
  }

  fetchProgramManagerRequest(id: any, data?: string) {
    let mesgParams = new HttpParams();

    if (data) {
      mesgParams = mesgParams.append('startDate', data);
    }

    return this.http.get(environment.fetchProgramManagerRequest + id, {
      params: mesgParams,
    });
  }

  programManagerApproval(id: any) {
    return this.http.post(environment.programManagerApproval + id, '');
  }

  programManagerRejection(sno: any, data: any) {
    let mesgParams = new HttpParams();
    mesgParams = mesgParams.append('comments', data);
    return this.http.post(environment.programManagerRejected + sno, data, {
      params: mesgParams,
    });
  }

  fetchFunderDetails(funderId: any) {
    return this.http.get(environment.fetchFunderDetails + funderId);
  }

  fetchPrctReqList(status: any, data?: string): Observable<any> {
    let params = new HttpParams();

    if (data) {
      params = params.append('startDate', data);
    }

    return this.http.get(environment.fetchProcurementList + status, {
      params: params,
    });
  }

  holdOrRejectcomments(id: any, data: any, check: number) {
    let commendParams = new HttpParams();
    commendParams = commendParams.append('comments', data.toString());
    console.log('typeof data:', typeof data);
    console.log('commendParams:', commendParams);

    if (check === 1) {
      return this.http.post(
        environment.prctHolding + id,
        {},
        { params: commendParams },
      );
    }
    if (check === 2) {
      return this.http.post(
        environment.prcReject + id,
        {},
        { params: commendParams },
      );
    }
    return null;
  }

  fetchQuoteComparison(
    sno: number,
    headOfAccId: number,
  ): Observable<QuoteComparison> {
    return this.http.get<QuoteComparison>(
      environment.fetchQuoteComparison +
        `?sno=${sno}&headOfAccId=${headOfAccId}`,
    );
  }

  fetchQuoteComparisonPDF(sno: number, headOfAccId: number) {
    return this.http.get(
      environment.fetchQuoteComparisonPDF +
        `?sno=${sno}&headOfAccId=${headOfAccId}`,
      {
        responseType: 'blob',
      },
    );
  }

  // fetchNormalRequest(startDate: Date | undefined, endDate: Date | undefined){
  //   return this.http.get(environment.fetchNormalRequest + `?startDate=${startDate}&endDate=${endDate}`)
  // }

  fetchConsolidatedQuotePDF(reqId: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(environment.fetchConsolidatedQuotePDF + reqId, {
      headers,
      responseType: 'blob',
    });
  }

  fetchSpecialRolesRequestIsProcess(
    statusCode: number,
    specialRoleId: number,
  ): Observable<Request[]> {
    return this.http.get<Request[]>(
      environment.fetchSpecialRolesRequestIsProcess +
        `${statusCode}?specialRoleId=${specialRoleId}`,
    );
  }

  fetchSpecialRolesRequestIsAccept(
    statusCode: number,
    specialRoleId: number,
    startDate: string,
  ) {
    return this.http.get(
      environment.fetchSpecialRolesRequestIsAccept +
        `${statusCode}?specialRoleId=${specialRoleId}&startDate=${startDate}`,
    );
  }

  acceptSpecialRoleRequest(specialRoleId: number, reqList: { sno: number }[]) {
    return this.http.post(
      environment.acceptSpecialRoleRequest + `?specialRoleId=${specialRoleId}`,
      reqList,
    );
  }

  fetchDateWiseAllIndentReport(
    branchCode: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) {
    return this.http.get(
      environment.fetchDateWiseAllIndentReport +
        `?branchCode=${branchCode}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' },
    );
  }

  fetchUrgentIndentReport(
    branchCode: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) {
    return this.http.get(
      environment.fetchUrgentIndentReport +
        `?branchCode=${branchCode}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' },
    );
  }

  fetchNormalIndentReport(
    branchCode: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) {
    return this.http.get(
      environment.fetchNormalIndentReport +
        `?branchCode=${branchCode}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' },
    );
  }

  fetchCompletedIndentReport(
    branchCode: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) {
    return this.http.get(
      environment.fetchCompletedIndentReport +
        `?branchCode=${branchCode}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' },
    );
  }

  fetchRejectedIndentReport(
    branchCode: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) {
    return this.http.get(
      environment.fetchRejectedIndentReport +
        `?branchCode=${branchCode}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' },
    );
  }

  fetchHeadOfAccByIndent(indentId: string) {
    return this.http.get(
      environment.fetchHeadOfAccByIndent + `?requestNo=${indentId}`,
    );
  }

  generatePurchaseOrderPDF(sno: number, headOfAccId: number) {
    return this.http.get(
      environment.generatePurchaseOrder + `${sno}?headOfAccId=${headOfAccId}`,
    );
  }

  fetchRequestByIndentCode(indentCode: string): Observable<Request> {
    return this.http.get<Request>(
      environment.fetchRequestByIndentCode + indentCode,
    );
  }

  getDebouncedSearchObservable(): Observable<string> {
    return this.searchSubject.pipe(debounceTime(400));
  }

  triggerSearch(indentCode: string){
    this.searchSubject.next(indentCode);
  }

  fetchPOPrefixCode(POId: number): Observable<Prefix>{
    return this.http.get<Prefix>(environment.fetchPOPrefixCode + POId);
  }

  fetchIndentPrefixCode(IndentId: number): Observable<Prefix>{
    return this.http.get<Prefix>(environment.fetchIndentPrefixCode + IndentId);
  }
}
