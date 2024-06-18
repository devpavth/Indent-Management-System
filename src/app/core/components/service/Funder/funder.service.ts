import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FunderService {
  constructor(private http: HttpClient) {}

  registerFunder(data: object) {
    return this.http.post(environment.addFunder, data);
  }
  funderList() {
    return this.http.get(environment.getAllFunderList);
  }

  deleteFunder(id: any) {
    return this.http.post(environment.deleteFunder + id, '');
  }
  assignFundertoBranch(branchId: any, funderId: any) {
    let params = new HttpParams();
    params = params.append('branchId', branchId);
    return this.http.post(environment.assignFunder + funderId, '', {
      params: params,
    });
  }
  assignedBranch(id: any) {
    return this.http.get(environment.AssignedBranch + id);
  }

  addFund(data: any, fundId: any) {
    return this.http.post(environment.addFund + fundId, data);
  }
}
