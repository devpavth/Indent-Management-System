import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css',
})
export class AddBranchComponent {
  constructor(
    private readonly countryStateCity: SharedServiceService,
    private fb: FormBuilder,
    private readonly branchService: BranchService,
  ) {
    this.addBranchForm = this.fb.group({
      branchName: [],
      manager: [],
      branchMobilenumber: [],
      add1: [],
      add2: [],
      country: [],
      city: [],
      state: [],
      pinCode: [],
      gstNumber: [],
    });
  }

  _state: any;
  _city: any;
  _department: any[] = [];
  isDepartment = false;

  addBranchForm: FormGroup;

  fetchState(selectedValue: string) {
    console.log(selectedValue);

    this.countryStateCity.getState(selectedValue).subscribe((res) => {
      this._state = res;
    });
  }

  fetchCity(city: string) {
    this.countryStateCity.getCity(city).subscribe((res) => {
      this._city = res;
    });
  }
  addDepartList(data: any) {
    this.isDepartment = true;
    let departlist = { deptName: data };
    this._department.push(departlist);
    console.log(this._department);
  }
  removeDepartmentList(index: any) {
    this._department.splice(index, 1);
  }
  submitBranchForm(data: any) {
    let list = data;
    let branchDetails = { ...list, departments: this._department };
    console.log(branchDetails);

    this.branchService.addBranch(branchDetails).subscribe((res) => {
      console.log(res);
    });
  }
}
