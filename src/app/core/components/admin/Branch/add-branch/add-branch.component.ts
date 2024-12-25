import { Component, inject, OnInit } from '@angular/core';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from '../../../service/Branch/branch.service';
import { Router } from '@angular/router';
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
      branchName: [, [Validators.required, Validators.minLength(2)]],
      manager: [, [Validators.required, Validators.minLength(2)]],
      branchMobilenumber: [, [Validators.required, Validators.minLength(10)]],
      add1: [, [Validators.required, Validators.minLength(50), Validators.maxLength(150)]],
      add2: [, [Validators.required, Validators.minLength(50), Validators.maxLength(100)]],
      country: [, [Validators.required, Validators.minLength(2)]],
      city: [, [Validators.required, Validators.minLength(2)]],
      state: [, [Validators.required, Validators.minLength(2)]],
      pinCode: [, [Validators.required, Validators.minLength(2)]],
      gstNumber: [
        ,
        [
          Validators.required,
          Validators.pattern(
            '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$',
          ),
        ],
      ],
    });
  }
  ngOnInit(): void {
    this.fetchDeptList();
  }

  _state: any;
  _city: any;
  _department: any[] = [];
  selectedDepartments: any[] = [];
  isDepartment = false;

  private route = inject(Router);

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
      this._department = res;
      console.log(res);
      console.log(this._department);
    });
  }

  addDepartList(data: string) {
    this.isDepartment = true;
    // console.log('hello', data);

    let departmentid = this._department.find((dep) => dep.departId == data);
    console.log(departmentid);

    let alreadyselect = this.selectedDepartments.some(
      (dep: any) => dep.departId == data,
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
      departments: this.selectedDepartments.map((dept) => ({
        selcdDeptId: dept.departId,
        deptStatus: 200,
      })),
    };
    console.log(list);

    this.branchService.addBranch(list).subscribe((res) => {
      console.log("adding branch details:",res);
      
    },(error) => {
      if(error.status === 200){
        console.log("status 200 ok:", error);
        this.route.navigate(["home/branchList"]);
      }
    });
  }
}
