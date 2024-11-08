import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrl: './view-branch.component.css',
})
export class ViewBranchComponent implements OnInit {
  @Output() closeViewBranch = new EventEmitter<boolean>();
  @Output() closeSuccess = new EventEmitter<boolean>();
  @Input() getBranchCode: any;

  _branch: any;
  _department: any[] = [];

  departmentProvidedList: any;
  selectedDepartments: any[] = [];
  isSave: boolean = false;
  isEdit: boolean = true;
  date = new Date();
  isclose = true;

  constructor(
    private fb: FormBuilder,
    private readonly countryStateCity: SharedServiceService,
    private branchService: BranchService,
  ) {
    this.viewBranchForm = this.fb.group({
      branchId: [],
      branchName: [],
      branchCode: [],
      manager: [],
      branchMobilenumber: [],
      add1: [],
      add2: [],
      country: [],
      city: [],
      state: [],
      pinCode: [],
      gstNumber: [],
      departments: [],
    });
  }
  ngOnInit() {
    this.fetchBranchDetails();
    this.fetchDeptList();
    console.log(this.getBranchCode);
    this.viewBranchForm.get('branchName')?.disable();
    this.viewBranchForm.get('manager')?.disable();
    this.viewBranchForm.get('branchMobilenumber')?.disable();
    this.viewBranchForm.get('add1')?.disable();
    this.viewBranchForm.get('add2')?.disable();
    this.viewBranchForm.get('country')?.disable();
    this.viewBranchForm.get('city')?.disable();
    this.viewBranchForm.get('state')?.disable();
    this.viewBranchForm.get('pinCode')?.disable();
    this.viewBranchForm.get('gstNumber')?.disable();
    this.viewBranchForm.get('departments')?.disable();
  }

  fetchBranchDetails() {
    console.log(this.getBranchCode);
    this.branchService.getBranchDetails(this.getBranchCode).subscribe((res) => {
      console.log(res);
      this._branch = res;
      this._department = this._branch.departments;
      console.log(this._department);

      this.viewBranchForm.patchValue({
        branchId: this._branch.branchId,
        branchCode: this._branch.branchCode,
        branchName: this._branch.branchName,
        manager: this._branch.manager,
        branchMobilenumber: this._branch.branchMobilenumber,
        add1: this._branch.add1,
        add2: this._branch.add2,
        country: this._branch.country,
        city: this._branch.city,
        state: this._branch.state,
        pinCode: this._branch.pinCode,
        gstNumber: this._branch.gstNumber,
        departments: this._branch.departments.deptName,
      });
      this.fetchState(this._branch.country);

      this.fetchCity(this._branch.state);
    });
  }

  _state: any;
  _city: any;
  viewBranchForm: FormGroup;
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
      this.departmentProvidedList = res;
      console.log(res);
      console.log(this.departmentProvidedList);
    });
  }
  addDepartList(data: string) {
    console.log(data);

    let departmentid = this.departmentProvidedList.find(
      (dep: any) => dep.departId == data,
    );
    let alreadyselect = this._department.some((dep) => dep.departId == data);
    // console.log(departmentid);
    console.log(alreadyselect);

    if (departmentid && !alreadyselect) {
      console.log(departmentid);
      console.log(alreadyselect);

      this.selectedDepartments.push(departmentid);
      console.log(this.selectedDepartments.map((fin) => fin.departId));
      this.branchService
        .addBranchDepartment(
          this._branch.branchId,
          this.selectedDepartments.map((fin) => fin.departId),
        )
        .subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);

            if (error.status == 200) {
              this.selectedDepartments = [];
              this.viewBranchForm.get('departments')?.reset();
              this.ngOnInit();
            }
            if (error.status == 409) {
              this.selectedDepartments = [];
            }
          },
        );
    }
  }
  // addDepartList(deptlist: any) {
  //   console.log(deptlist);
  //   let list = [{ deptName: deptlist }];
  //   console.log(list);
  // }
  deleteDept(dept: any) {
    console.log(dept);
    this.branchService.deleteDepart(dept).subscribe(
      (res) => {
        console.log('delete Department');
      },
      (error) => {
        if (error.status == 200) {
          this.ngOnInit();
        }
      },
    );
  }
  enableEdit() {
    this.viewBranchForm.get('branchName')?.enable();
    this.viewBranchForm.get('manager')?.enable();
    this.viewBranchForm.get('branchMobilenumber')?.enable();
    this.viewBranchForm.get('add1')?.enable();
    this.viewBranchForm.get('add2')?.enable();
    this.viewBranchForm.get('country')?.enable();
    this.viewBranchForm.get('city')?.enable();
    this.viewBranchForm.get('state')?.enable();
    this.viewBranchForm.get('pinCode')?.enable();
    this.viewBranchForm.get('gstNumber')?.enable();
    this.viewBranchForm.get('departments')?.enable();
    this.isEdit = false;
    this.isSave = true;
  }
  updateBranch(data: any) {
    console.log(data);
    let list = { ...data, departments: this._department };
    console.log(list);

    this.branchService.updateBranch(list).subscribe(
      (res) => {
        console.log(res);
        // this.closeSuccess.emit(true)
        // console.log('jjhgh');
      },
      (error) => {
        if (error.status == 200) {
          this.closeSuccess.emit(true);
        }
      },
    );
  }
}
