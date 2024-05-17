import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormControlName,
  MinLengthValidator,
} from '@angular/forms';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';
import { BranchService } from '../../../service/Branch/branch.service';

// If all conditions met, return no error

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  maxDate: string;
  constructor(
    private readonly empService: EmployeeServiceService,
    private readonly http: HttpClient,
    private readonly branchService: BranchService,
  ) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18); // Subtract 18 years for minimum age
    this.maxDate = currentDate.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.fetchAllBranch();
  }

  fetchAllBranch() {
    this.branchService.getBranch().subscribe((res) => {
      console.log(res);

      this._branch = res;
    });
  }
  //Country state city
  _state: any;
  _city: any;

  //select option arrays
  _gender: any = ['Male', 'Female', 'Non-Binary'];
  _role: any = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  _designation: any = [
    'Admin',
    'Branch Manager',
    'Sales ',
    'Finance',
    'Human Resource',
  ];
  _branch: any;
  _department: any;

  isSuccess = false;
  isVerifiedEmail = false;
  isPhoneNo = false;
  isDepartment = false;
  date = new Date();
  empId = sessionStorage.getItem('userId');
  //form group
  addEmployeeForm = new FormGroup({
    createdBy: new FormControl(this.empId),
    createdTime: new FormControl(this.date),
    empStatus: new FormControl(200),
    empFirstName: new FormControl('', [Validators.required]),
    empLastName: new FormControl('', [Validators.required]),
    empPhone: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    empGender: new FormControl('Male', [Validators.required]),
    empEmail: new FormControl(
      '',
      Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-z]+.([a-z]{2})+(?:\.(com|in|edu|net)){1}$/,
      ),
    ),
    empDateofBirth: new FormControl('', [
      Validators.required,
      this.validateDateofBirth,
    ]),
    addressLine1: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(80),
    ]),
    addressLine2: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(80),
    ]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    pin: new FormControl('', Validators.pattern(/^[1-9]{1}[0-9]{5}$/)),
    country: new FormControl('', [Validators.required]),
    empRole: new FormControl('', [Validators.required]),
    empBranch: new FormControl('', [Validators.required]),
    empDepartment: new FormControl('', [Validators.required]),
    empDesignation: new FormControl('', [Validators.required]),
    empJoiningDate: new FormControl('', [Validators.required]),
    empFlag: new FormControl('Authorized'),
  });
  //number disable
  onNameInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(
      /[^a-zA-Z\s@]|(\s{2,})/g,
      function (match, p1) {
        return p1 ? ' ' : '';
      },
    );
    // Allow only letters and '@'
  }
  //letter disable
  onPhoneNumberInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Allow only digits (0-9)

    // Ensure only 10 digits are allowed
    if (inputElement.value.length > 10) {
      inputElement.value = inputElement.value.slice(0, 9); // Keep only the first 10 digits
    }
  }
  onPinNumberInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Allow only digits (0-9)

    // Ensure only 6 digits are allowed
    if (inputElement.value.length > 6) {
      inputElement.value = inputElement.value.slice(0, 5); // Keep only the first 6 digits
    }
  }

  //date validation
  validateDateofBirth(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const dob = new Date(control.value);
      const today = new Date();

      // Calculate age in years
      let diff = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        diff--;
      }

      // Check if age is less than 18
      if (diff < 18) {
        return { underAge: true };
      }

      // Check if date is in the future
      if (dob > today) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  addEmployee(employeeData: any) {
    // console.table(employeeData);

    this.empService.addEmployee(employeeData).subscribe(
      (res) => {
        console.log(res);

        this.addEmployeeForm.reset();
      },
      (error) => {
        if (error.status == 200) {
          this.isSuccess = true;
        } else {
          console.log(error.error);
        }
      },
    );
  }

  fetchState(state: string) {
    console.log(state);
    this.http
      .get(environment.countrySateCity + 'Country/' + `${state}`)
      .subscribe((res) => {
        console.log(res);

        this._state = res;
      });
  }

  fetchCity(city: string) {
    this.http.get(environment.countrySateCity + `${city}`).subscribe((res) => {
      this._city = res;
      console.log(this._city);
    });
  }

  verifyEmailId(data: any) {
    this.empService.verifyEmail(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 208) {
          console.log(error);
          this.isVerifiedEmail = true;
        } else if (error.statusText == 'OK') {
          this.isVerifiedEmail = false;
        }
      },
    );
  }

  verifyPhone(data: any) {
    this.empService.verifyPhoneNo(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 208) {
          this.isPhoneNo = true;
        } else if (error.status == 200) {
          this.isPhoneNo = false;
        }
      },
    );
  }

  viewAddDepartment(data: any) {
    this.isDepartment = !this.isDepartment;
    this.department(data);
  }

  department(data: any) {
    this.branchService.getBranchDepartment(data).subscribe((res) => {
      console.log(res);

      this._department = res;
    });
  }

  addBranchDepartment(branch: any, department: any) {
    console.log(department);
    let list = [{ deptName: department, deptStatus: 200 }];
    console.log(list);

    this.branchService.addBranchDepartment(branch, list).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this.isDepartment = !this.isDepartment;
          this.department(branch);
        }
      },
    );
  }
  inputText: string = '';

  onInputChange(event: any) {
    // Capitalize the first letter of the input text
    this.inputText =
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
  }
}
