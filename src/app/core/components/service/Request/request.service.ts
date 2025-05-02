import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { debounceTime, Observable, Subject } from 'rxjs';
import { QuoteComparison } from '../../../models/quoteComparison/quote-comparison.model';
import { Prefix } from '../../../models/prefix/prefix.model';
import { Polist } from '../../../models/polist/polist.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private searchSubject = new Subject<string>();

  constructor(private readonly http: HttpClient) {}
  postRequestIndent(req: any) {
    return this.http.post(environment.postRequestIndent, req);
  }
  getUserReq(
    status: number,
    startDate?: string | undefined,
    endDate?: string | undefined,
  ) {
    let url = `${environment.getYourReq}/${status}`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    console.log('user request api:', url);
    return this.http.get(url);
  }
  viewReq(data: any): Observable<any> {
    return this.http.get(environment.viewYourReq + data);
  }
  reqProduct(data: any) {
    return this.http.get(environment.reqProduct + data);
  }

  branchRequestList(status: number, startDate?: string | undefined, endDate?: string | undefined) {
    let url = `${environment.branchApprovelList}/${status}`;

    if(startDate && endDate){
      url += `?startDate=${startDate}&endDate=${endDate}`
    }

    return this.http.get(url);
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
  adminRequestList(status: number, startDate?: string | undefined, endDate?: string | undefined) {
    let url = `${environment.adminAprovalList}${status}`;

    if(startDate && endDate){
      url += `?startDate=${startDate}&endDate=${endDate}`
    }

    return this.http.get(url);
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
  finRequestList(status: number, startDate?: string | undefined, endDate?: string | undefined): Observable<any> {
    let url = `${environment.finRequestList}${status}`;

    if(startDate && endDate){
      url += `?startDate=${startDate}&endDate=${endDate}`
    }

    return this.http.get(url);
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

  fetchProgramManagerRequest(
    status: any,
    startDate?: string | undefined,
    endDate?: string | undefined,
  ) {
    let url = `${environment.fetchProgramManagerRequest}/${status}`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    return this.http.get(url);
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

  fetchPrctReqList(
    status: number,
    startDate?: string | undefined,
    endDate?: string | undefined,
  ) {
    let url = `${environment.fetchProcurementList}/${status}`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    return this.http.get(url);
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

  fetchSpecialRolesRequestIsProcessAndAccept(
    statusCode: number,
    specialRoleId: number,
    startDate?: string | undefined,
    endDate?: string | undefined
  ): Observable<Request[]> {
    let url = `${environment.fetchSpecialRolesRequestIsProcessAndAccept}${statusCode}?specialRoleId=${specialRoleId}`;

    if(startDate && endDate){
      url += `&startDate=${startDate}&endDate=${endDate}`
    }

    return this.http.get<Request[]>(url);
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

  generatePurchaseOrderPDF(sno: number, headOfAccId: number | null) {
    return this.http.get(
      environment.generatePurchaseOrder + `${sno}?headOfAccId=${headOfAccId}`,
    );
  }

  fetchRequestByIndentCode(indentCode: string): Observable<Request[]> {
    return this.http.get<Request[]>(
      environment.fetchRequestByIndentCode + indentCode,
    );
  }

  getDebouncedSearchObservable(): Observable<string> {
    return this.searchSubject.pipe(debounceTime(400));
  }

  triggerSearch(indentCode: string) {
    this.searchSubject.next(indentCode);
  }

  updateIndentRequestDetails(indentID: number, indentData: any) {
    return this.http.put(
      environment.updateIndentRequestDetails + indentID,
      indentData,
    );
  }

  fetchPurchaseOrderList(
    startDate: string | undefined,
    endDate: string | undefined,
  ): Observable<Polist[]> {
    return this.http.get<Polist[]>(
      environment.purchaseOrderList +
        `?startDate=${startDate}&endDate=${endDate}`,
    );
  }

  viewPurchaseOrder(sno: number, headOfAccId: number | null) {
    return this.http.get(
      environment.viewPurchaseOrder + `${sno}?headOfAccId=${headOfAccId}`,
    );
  }

  searchPurchaseOrder(PONumber: string): Observable<Polist[]>{
    return this.http.get<Polist[]>(environment.searchPurchaseOrder + PONumber);
  }

  updatePOProductStatus(POId: number){
    return this.http.put(environment.updatePOProductStatus + POId, '');
  }

  deletePOItemFromList(POId: number){
    return this.http.delete(environment.deletePOItem + POId);
  }
}
