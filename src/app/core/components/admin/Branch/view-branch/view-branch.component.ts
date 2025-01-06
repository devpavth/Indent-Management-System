import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { BranchService } from '../../../service/Branch/branch.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

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

  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: any[] = [];
  cityDropDownOptions: any;

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
    console.log("getting branch details:",this.getBranchCode);
    

    Object.keys(this.viewBranchForm.controls).forEach((form) => {
      this.viewBranchForm.get(form)?.disable();
    });

    this.viewBranchForm.get('pinCode')?.valueChanges
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
          catchError((error) =>{
            if(error.status === "Error"){
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
        console.log("typeof Pincode API Error:", typeof response?.[0]?.status);

        if(response?.[0]?.status === "Error"
          && this.pincodeList.length === 0
        ){
          console.log("Pincode API Error:", response?.[0]?.status);
          this.noPincode = true;

          this.viewBranchForm.patchValue({
            city: '',
            state: '',
            country: '',
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
          )

          console.log("cityDropDownOptions:", cityDropDownOptions);

          this.viewBranchForm.patchValue({
            city: cityDropDownOptions[0].value,
            state: this.pincodeList[0].state,
            country: this.pincodeList[0].country
          },
          {emitEvent: false}
        )
        this.cityDropDownOptions = cityDropDownOptions;
        }
        this.isPincodeSelected = false;
      }
    )
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
    Object.keys(this.viewBranchForm.controls).forEach((form) => {
      this.viewBranchForm.get(form)?.enable();
    });

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
