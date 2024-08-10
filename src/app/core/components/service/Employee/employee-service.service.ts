import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeServiceService {
  constructor(private readonly http: HttpClient) {}

  private _refrechData = new Subject<void>();
  get refrechData() {
    return this._refrechData;
  }

  addEmployee(empData: any) {
    return this.http.post(environment.addEmployee, empData).pipe(
      tap(() => {
        this.refrechData.next();
      }),
    );
  }
  getEmployeeDetails(user: any) {
    return this.http.get(environment.getUserDetail + user);
  }
  getAllEmployeeDetails(sno: any) {
    return this.http.get(environment.getAllEmployeeDetails);
  }
  updateEmployeeDetails(data: any) {
    return this.http.post(environment.updateEmployee, data).pipe(
      tap(() => {
        this.refrechData.next();
      }),
    );
  }

  deleteEmployee(data: any) {
    return this.http.post(environment.deleteEmployee, data).pipe(
      tap(() => {
        this.refrechData.next();
      }),
    );
  }
  verifyEmail(email: any) {
    let emailParams = new HttpParams();
    emailParams = emailParams.append('empEmailid', email);
    return this.http.get(environment.verifyEmail, { params: emailParams });
  }

  verifyPhoneNo(phone: any) {
    let phoneParams = new HttpParams();
    phoneParams = phoneParams.append('empPhone', phone);
    return this.http.get(environment.verifyPhoneNo, { params: phoneParams });
  }

  getDesignation() {
    return this.http.get(environment.getDesignation);
  }
}
