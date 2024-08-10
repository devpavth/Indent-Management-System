import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private readonly http: HttpClient) {}

  getBranch() {
    return this.http.get(environment.getBranch);
  }
  addBranch(branch: any) {
    return this.http.post(environment.addNewBranch, branch);
  }
  getAllBranch() {
    return this.http.get(environment.getAllBranch);
  }
  getBranchDepartment(data: any) {
    return this.http.get(environment.getBranch + `/${data}`);
  }
  addBranchDepartment(branch: any, department: any) {
    let departParams = new HttpParams();
    departParams = departParams.append('selcdDeptId', department);
    return this.http.post(
      environment.addBranchDepartment + `${branch}`,
      {},
      { params: departParams },
    );
  }
  getBranchDetails(data: any) {
    return this.http.get(environment.getBranchDetails + `/${data}`);
  }
  deleteDepart(dept: any) {
    let deptParams = new HttpParams();
    deptParams = deptParams.append('deptId', dept);
    return this.http.post(environment.deleteDept, '', { params: deptParams });
  }
  updateBranch(data: any) {
    return this.http.post(environment.updateBranch, data);
  }
  getAllDepartments() {
    return this.http.get(environment.getAlldepartment);
  }

  getAllProj() {
    return this.http.get(environment.getProjOrProg);
  }

  addNewDepart(data: any) {
    return this.http.post(environment.addNewDepartment, data);
  }

  addNewProj(data: any) {
    return this.http.post(environment.addNewProject, data);
  }
  deleteProj(id: string) {
    return this.http.post(environment.deletProj + id, id);
  }
  updateDepartment(data: any) {
    return this.http.post(environment.updateDepartment + data.departId, data);
  }
  deleteDepartment(id: any) {
    return this.http.post(environment.deleteDepart + id, id);
  }
}
