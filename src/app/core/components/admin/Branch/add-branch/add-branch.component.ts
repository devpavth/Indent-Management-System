import { Component, inject, OnInit } from '@angular/core';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from '../../../service/Branch/branch.service';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { Pincode } from '../../../../models/pincode/pincode.model';
@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css',
})
export class AddBranchComponent implements OnInit {
  loading: boolean = false;
  constructor(
    private readonly countryStateCity: SharedServiceService,
    private fb: FormBuilder,
    private readonly branchService: BranchService,
  ) {
    this.addBranchForm = this.fb.group({
      branchName: [, [Validators.required, Validators.minLength(3)]],
      manager: [, [Validators.required, Validators.minLength(2)]],
      branchMobilenumber: [, [Validators.required, Validators.minLength(10)]],
      add1: [
        ,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150),
        ],
      ],
      add2: [
        ,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      country: [, [Validators.required, Validators.minLength(2)]],
      city: [, [Validators.required, Validators.minLength(2)]],
      state: [, [Validators.required, Validators.minLength(2)]],
      pinCode: [, [Validators.required, Validators.minLength(6)]],
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
    this.addBranchForm
      .get('pinCode')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((pincode) => {
          if (this.isPincodeSelected) {
            return of([]);
          }
          this.noPincode = false;
          if (!pincode?.trim()) {
            this.pincodeList = [];
            return of([]);
          }
          return this.countryStateCity.fetchPincode(pincode).pipe(
            catchError((error) => {
              if (error.status === 'Error') {
                console.log('Pincode API Error:', error);
                this.noPincode = true;
              }
              return of([]);
            }),
          );
        }),
      )
      .subscribe((response: any) => {
        const postOfficeArray = response?.[0]?.postOffice ?? [];
        console.log('postOfficeArray:', postOfficeArray);

        this.pincodeList = postOfficeArray;
        console.log('reponse from pincode:', response);
        console.log('fetching pincode with live search:', this.pincodeList);

        if(response?.[0]?.status === 'Error' &&
          this.pincodeList.length === 0
        ){
          console.log('Pincode API Error:', response?.[0]?.status);
          this.noPincode = true;

          this.addBranchForm.patchValue(
            {
              city: '',
              state: '',
              country: '',
            },
            { emitEvent: false },
          );
        }

        if (this.pincodeList.length > 0) {
          const cityDropDownOptions = this.pincodeList.map((address) => ({
            label: `${address.name}, ${address.city}`,
            value: `${address.name}, ${address.city}`,
          }));
          console.log('cityDropDownOptions:', cityDropDownOptions);

          this.addBranchForm.patchValue(
            {
              city: cityDropDownOptions[0].value,
              state: this.pincodeList[0].state,
              country: this.pincodeList[0].country,
            },
            { emitEvent: false },
          );
          this.cityDropDownOptions = cityDropDownOptions;
        }
        this.isPincodeSelected = false;
      });
  }

  _state: any;
  _city: any;
  _department: any[] = [];
  selectedDepartments: any[] = [];
  isDepartment = false;

  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: Pincode[] = [];
  cityDropDownOptions: any;

  private route = inject(Router);

  addBranchForm: FormGroup;

  onNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    if (value.startsWith(' ')) {
      value = value.trimStart();
    }

    value = value.replace(/[^a-zA-Z\s]|(\s{2,})/g, (match, p1) =>
      p1 ? ' ' : '',
    );

    inputElement.value = value;
  }

  onManagerInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    if (value.startsWith(' ')) {
      value = value.trimStart();
    }

    value = value.replace(/[^a-zA-Z0-9\s]|(\s{2,})/g, (match, p1) =>
      p1 ? ' ' : '',
    );

    inputElement.value = value;
  }

  onPhoneNumberInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let digitOnly = inputElement.value.replace(/[^0-9]/g, '');

    if (digitOnly.length > 10) {
      digitOnly = digitOnly.slice(0, 10);
    }

    inputElement.value = digitOnly;
    this.addBranchForm.get('branchMobilenumber')?.setValue(digitOnly, {
      emitEvent: false,
    });
  }

  onAddressInput(event: Event, controlName: string, maxLength: number){
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if(value.length >= maxLength){
      const trimmed = value.slice(0, maxLength);
      input.value = trimmed;

      this.addBranchForm.get(controlName)?.setValue(trimmed, {
        emitEvent: false,
      });

      this.addBranchForm.get(controlName)?.setErrors({maxlength: true});
    }
  }

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

    this.loading = true;

    this.branchService.addBranch(list).subscribe(
      (res) => {
        console.log('adding branch details:', res);
        this.loading = false;
        this.route.navigate(['home/branchList']);
      },
      (error) => {
        this.loading = false;
        if (error.status === 200) {
          console.log('status 200 ok:', error);
          this.loading = false;
          this.route.navigate(['home/branchList']);
        }
      },
    );
  }
}
