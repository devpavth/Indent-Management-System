import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { DesignationRoleMapping, RoleMapping } from '../../../models/designationRoleMapping/designation-role-mapping.model';

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

  // deleteEmployee(employeeId: string) {
  //   console.log("Sending delete request with data:", employeeId);
  //   return this.http.post(environment.deleteEmployee, {employeeId}).pipe(
  //     tap((res) => {
  //       console.log("Server response:", res);
  //       this.refrechData.next();
  //     }),
  //     catchError((error) => {
  //       console.error("Error deleting employee:", error);
  //       throw error;
  //     })
  //   );
  // }

  deleteEmployee(employeeId: string) {
    console.log('Sending delete request for employee ID:', employeeId);
    console.log('Delete URL:', environment.deleteEmployee + employeeId);
    return this.http.post(environment.deleteEmployee + employeeId, '');
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

  getDesignationRoleMapping(): Observable<DesignationRoleMapping[]> {
    return this.http.get<DesignationRoleMapping[]>(
      environment.getDesignationRoleMapping,
    );
  }

  getDesignationRole(): Observable<RoleMapping[]> {
    return this.http.get<RoleMapping[]>(environment.getDesignationRole);
  }

  fetchDesignationAssignedRole(
    designId: number | undefined,
  ): Observable<DesignationRoleMapping> {
    return this.http.get<DesignationRoleMapping>(
      environment.fetchDesignationAssignedRole + designId,
    );
  }

  assigningRoleToDesignation(designationId: number | undefined, roleId: number){
    let params = new HttpParams();

    if(designationId !== undefined){
      params = params.append('empDesig', designationId.toString());
    }
    params = params.append('roleId', roleId.toString());

    return this.http.post(environment.assigningRoleToDesignation, {}, {params})
  }
}
