import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css',
})
export class ViewEmployeeComponent implements OnInit {
  constructor(
    private readonly EmployeeService: EmployeeServiceService,
    private readonly countryStateCity: SharedServiceService,
    private AdminService: AdminProductServiceService,
    private branchService: BranchService,
  ) {}
  @Output() closeEmployeePop = new EventEmitter<boolean>();
  @Input() EmployeeCode: any;
  @Output() showSuccess = new EventEmitter<boolean>();
  @Output() isDeletePop = new EventEmitter<boolean>();

  _state: any;
  _city: any;

  //select option arrays
  _gender: any = ['Male', 'Female', 'Non-Binary'];
  _role: any = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  _designation: any;
  _branch: any;
  _department: any;
  viewEmployeeForm: any;
  _employeeDetails: any;

  isEdit = true;
  isSave = false;
  isSaveIcon = true;
  isLoad = false;

  isStyle = false;

  ngOnInit() {
    console.log(this.EmployeeCode);

    this.EmployeeService.getEmployeeDetails(this.EmployeeCode).subscribe(
      (res) => {
        this._employeeDetails = res;
        console.log(res);

        this.viewEmployeeForm = new FormGroup({
          employeeId: new FormControl(this._employeeDetails.employeeId),
          sno: new FormControl(this._employeeDetails.sno),

          empFirstName: new FormControl(this._employeeDetails.empFirstName, [
            Validators.required,
            Validators.pattern('[a-zA-Z]+'),
          ]),
          empLastName: new FormControl(this._employeeDetails.empLastName, [
            Validators.required,
            Validators.pattern('[a-zA-Z]+'),
          ]),
          empPhone: new FormControl(
            this._employeeDetails.empPhone,
            Validators.pattern('[1-9]{1}[0-9]{9}'),
          ),
          empGender: new FormControl(this._employeeDetails.empGender, [
            Validators.required,
          ]),
          empEmail: new FormControl(
            this._employeeDetails.empEmail,
            Validators.email,
          ),
          empDateofBirth: new FormControl(
            this._employeeDetails.empDateofBirth,
            [Validators.required],
          ),
          addressLine1: new FormControl(this._employeeDetails.addressLine1, [
            Validators.required,
          ]),
          addressLine2: new FormControl(this._employeeDetails.addressLine2, [
            Validators.required,
          ]),
          state: new FormControl(this._employeeDetails.state, [
            Validators.required,
          ]),
          city: new FormControl(this._employeeDetails.city, [
            Validators.required,
          ]),
          pin: new FormControl(
            this._employeeDetails.pin,
            Validators.pattern(/^[0-9]{6}$/),
          ),
          country: new FormControl(this._employeeDetails.country, [
            Validators.required,
          ]),
          empRole: new FormControl(this._employeeDetails.empRole, [
            Validators.required,
          ]),
          empBranch: new FormControl(this._employeeDetails.empBranch, [
            Validators.required,
          ]),

          empDesig: new FormControl(this._employeeDetails.empDesig, [
            Validators.required,
          ]),
          empFlag: new FormControl(this._employeeDetails.empFlag.toString(), [
            Validators.required,
          ]),
          empJoiningDate: new FormControl(
            this._employeeDetails.empJoiningDate,
            [Validators.required],
          ),
          createdBy: new FormControl(this._employeeDetails.createdBy, [
            Validators.required,
          ]),
          createdTime: new FormControl(this._employeeDetails.createdTime, [
            Validators.required,
          ]),
          empStatus: new FormControl(this._employeeDetails.empStatus, [
            Validators.required,
          ]),
          modifiedTime: new FormControl(new Date()),
          modifyby: new FormControl(sessionStorage.getItem('userId')),
        });

        this.fetchState(this._employeeDetails.country);
        this.fetchCity(this._employeeDetails.state);
        this.fetchAllBranch();

        this.fetchDesignation();
        Object.keys(this.viewEmployeeForm.controls).forEach((form) => {
          this.viewEmployeeForm.get(form)?.disable();
        });
      },
    );
  }

  fetchAllBranch() {
    this.branchService.getBranch().subscribe((res) => {
      console.log(res);

      this._branch = res;
    });
  }

  fetchState(selectedValue: string) {
    this.countryStateCity.getState(selectedValue).subscribe((res) => {
      this._state = res;
    });
  }

  fetchCity(city: string) {
    this.countryStateCity.getCity(city).subscribe((res) => {
      this._city = res;
    });
  }

  closeEmployeeView() {
    this.isStyle = true;
    this.closeEmployeePop.emit(false);
  }

  enableEdit() {
    Object.keys(this.viewEmployeeForm.controls).forEach((form) => {
      this.viewEmployeeForm.get(form)?.enable();
    });

    this.isSave = true;
    this.isEdit = false;
    this.isSaveIcon = true;
    this.isLoad = false;
  }

  fetchDesignation() {
    this.EmployeeService.getDesignation().subscribe((res: any) => {
      console.log(res);
      let check = this.viewEmployeeForm.get('empRole')?.value;
      if (check == 'Level 1') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 1')
          .map((key) => ({ index: key, name: res[key][0] }));
        console.log(this._designation);
      } else if (check == 'Level 2') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 2')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else if (check == 'Level 3') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 3')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else if (check == 'Level 4') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 4')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else if (check == 'Level 5') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 5')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else {
        this._designation = [{ index: 0, name: 'Not Data' }];
      }
    });
  }

  updateEmployeeDetails(data: any) {
    console.log(data);

    this.EmployeeService.updateEmployeeDetails(data).subscribe((res) => {
      console.log(res);
    });
    this.showSuccess.emit(true);
  }

  deleteEmployeeDetails(test: any) {
    console.log("deleting employee details:",test);

    this.isDeletePop.emit(true);
    this.AdminService.employeeCode = test;
  }
}
