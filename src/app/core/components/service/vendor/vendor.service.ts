import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  constructor(private http: HttpClient) {}

  addVendor(data: any) {
    return this.http.post(environment.addVendor, data);
  }
  getAllVendor() {
    return this.http.get(environment.getAllVendorList);
  }
  deleteVendor(id: any) {
    return this.http.post(environment.deleteVendor + id, '');
  }
  updateVendor(id: any, data: any) {
    return this.http.post(environment.updateVendor + id, data);
  }
  getBranch() {
    return this.http.get(environment.getBranchName);
  }
  deleteAccount(id: any) {
    return this.http.post(environment.deleteAccount + id, '');
  }
  updateBankAcc(id: any, data: any) {
    return this.http.post(environment.updateAccount + id, data);
  }
  getVendorName() {
    return this.http.get(environment.getVendorName);
  }
}
