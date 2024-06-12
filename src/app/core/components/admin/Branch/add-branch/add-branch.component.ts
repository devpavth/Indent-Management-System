import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css',
})
export class AddBranchComponent implements OnInit {
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
  ngOnInit(): void {
    this.fetchDeptList();
  }

  _state: any;
  _city: any;
  _department: any[] = [];
  selectedDepartments: { selcdDeptId: string; dName: string }[] = [];
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

  fetchDeptList() {
    this.branchService.getAllDepartments().subscribe((res: any) => {
      this._department = Object.entries(res).map(([selcdDeptId, dName]) => ({
        selcdDeptId,
        dName,
      }));
      console.log(res);
      console.log(this._department);
    });
  }

  addDepartList(data: string) {
    this.isDepartment = true;
    let departmentid = this._department.find((dep) => dep.selcdDeptId === data);
    let alreadyselect = this.selectedDepartments.some(
      (dep) => dep.selcdDeptId === data,
    );
    console.log(departmentid);

    if (departmentid && !alreadyselect) {
      this.selectedDepartments.push(departmentid);
      console.log(this.selectedDepartments);
    }
  }
  removeDepartmentList(index: any) {
    this.selectedDepartments.splice(index, 1);
  }
  submitBranchForm(data: any) {
    console.log(data);
    let list = {
      ...data,
      departments: this.selectedDepartments.filter((fil) => fil.selcdDeptId),
    };
    console.log(list);

    this.branchService.addBranch(list).subscribe((res) => {
      console.log(res);
    });
  }
}
