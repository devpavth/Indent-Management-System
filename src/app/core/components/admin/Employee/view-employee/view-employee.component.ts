import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { AdminProductServiceService } from '../../admin-services/admin-product-service.service';
import { BranchService } from '../../../service/Branch/branch.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

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
  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: any[] = [];
  cityDropDownOptions: any;

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

        // this.viewEmployeeForm.markAllAsTouched();

        this.viewEmployeeForm.get('pin').valueChanges
        .pipe(
          debounceTime(300),
          switchMap((pincode) => {
            if(this.isPincodeSelected){
              return of([]);
            }
            this.noPincode = false;
            if(!pincode || pincode.toString().length !== 6){
              this.pincodeList = [];
              return of([]);
            }
            return this.countryStateCity.fetchPincode(pincode).pipe(
              catchError((error) => {
                if(error.status === 404){
                  console.log("Pincode API Error:", error);
                  this.noPincode = true;
                }
                return of([]);
              })
            )
          })
        )
        .subscribe(
          (response: any) => {
            const postOfficeArray = response?.[0]?.postOffice ?? [];
            console.log("postOfficeArray:", postOfficeArray);
            this.pincodeList = postOfficeArray;
            console.log("reponse from pincode:", response);
            console.log("fetching postOffice from pincode:", response.postOffice);
            console.log("fetching pincode with live search:", this.pincodeList);

            if(response?.[0]?.status === "Error"
                && this.pincodeList.length === 0
            ){
              console.log("Pincode API Error:", response?.[0]?.status);
              this.noPincode = true;

              this.viewEmployeeForm.patchValue({
                city: '',
                state: '',
                country: ''
              },
              {emitEvent: false}
            )
            }

            console.log("fetching pincode with live search:", this.pincodeList);


            if(this.pincodeList.length > 0){
              const cityDropDownOptions = this.pincodeList.map(
                (address) => ({
                  label: `${address.name}, ${address.city}`,
                  value: `${address.name}, ${address.city}`
                })
              );
              console.log("City dropdown options:", cityDropDownOptions);

              this.viewEmployeeForm.patchValue(
                {
                  city: cityDropDownOptions[0].value,
                  state: this.pincodeList[0].state,
                  country: this.pincodeList[0].country,
                },
                {emitEvent: false}
              )

              this.cityDropDownOptions = cityDropDownOptions;
            }
            this.isPincodeSelected = false;
          }
        )

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
    // this.viewEmployeeForm.get('empDesig')?.reset();
    // this.viewEmployeeForm.get('empDesig')?.setValue('');
    // this.viewEmployeeForm.get('empDesig')?.disable();
    // this.viewEmployeeForm.get('empDesig')?.clearValidators();
    // this.viewEmployeeForm.get('empDesig').Validators().required;
    // this.viewEmployeeForm.get('empDesig')?.clearValidators();
    // this.viewEmployeeForm.get('empDesig')?.updateValueAndValidity();
    
    // this.viewEmployeeForm.get('empDesig').m

    this.EmployeeService.getDesignation().subscribe((res: any) => {
      console.log("fetching designation:",res);
      let check = this.viewEmployeeForm.get('empRole')?.value;
      if (check == 'Level 1') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 1')
          .map((key) => ({ index: key, name: res[key][0] }));
        console.log("fetching designation in level 1:",this._designation);
      } else if (check == 'Level 2') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 2')
          .map((key) => ({ index: key, name: res[key][0] }));
        console.log("fetching designation in level 2:",this._designation);
      } else if (check == 'Level 3') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 3')
          .map((key) => ({ index: key, name: res[key][0] }));
          console.log("fetching designation in level 3:",this._designation);
      } else if (check == 'Level 4') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 4')
          .map((key) => ({ index: key, name: res[key][0] }));
          console.log("fetching designation in level 4:",this._designation);
      } else if (check == 'Level 5') {
        this._designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 5')
          .map((key) => ({ index: key, name: res[key][0] }));
          console.log("fetching designation in level 5:",this._designation);
      } else {
        this._designation = [{ index: 0, name: 'Not Data' }];
      }
      console.log("Designation fetched:", this._designation);

      if(this._designation.length > 0 && this.isSave){
        this.viewEmployeeForm.get('empDesig').setValue(this._designation[0].index)
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
