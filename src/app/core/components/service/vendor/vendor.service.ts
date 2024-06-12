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
    return this.http.post(environment.deleteVendor + id, id);
  }
}
