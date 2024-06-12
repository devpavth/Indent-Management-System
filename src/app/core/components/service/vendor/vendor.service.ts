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
<<<<<<< HEAD
  deleteVendor(id: any) {
    return this.http.post(environment.deleteVendor + id, id);
  }
=======
>>>>>>> 2b1d7429cbe2d4e0915b594db79d9708a0631ebf
}
