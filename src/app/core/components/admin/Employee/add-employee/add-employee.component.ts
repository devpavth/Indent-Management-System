import { Component, inject, OnInit } from '@angular/core';
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
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';

// If all conditions met, return no error

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  maxDate: string;
  designation: any;
  isPincodeSelected: boolean = false;
  noPincode: boolean = false;
  pincodeList: any[] = [];

  private sharedService = inject(SharedServiceService);
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

    this.addEmployeeForm.get('pin')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((pincode)=>{
        if(this.isPincodeSelected){
          return of([]);
        }
        this.noPincode = false;
        if(!pincode?.trim()){
          this.pincodeList = [];
          return of([]);
        }
        return this.sharedService.fetchPincode(pincode).pipe(
          catchError((error)=>{
            if(error.status === 404){
              console.log("Customer API Error:", error);
              this.noPincode = true;
            }
            return of([]);
          })
        )
      })
    )
    .subscribe(
      (response: any) => {
        this.pincodeList = response.postOffice;
        console.log("reponse from pincode:", response);
        console.log("fetching postOffice from pincode:", response.postOffice);
        this.isPincodeSelected = false;
      }
    )
    this.fetchAllBranch();
    this.fetchDesignation();
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

  _branch: any;

  isToast: boolean = false;
  warningToastMsg: any;

  empPopUpMsg: any;
  isSuccess = false;
  isVerifiedEmail: boolean = false;
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
      Validators.minLength(10),
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

    empDesig: new FormControl('', [Validators.required]),
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
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');

    if (inputElement.value.length > 10) {
      inputElement.value = inputElement.value.slice(0, 9);
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
    console.table(employeeData);

    this.empService.addEmployee(employeeData).subscribe(
      (res) => {
        console.log('server res', res);

        // this.addEmployeeForm.reset();
      },
      (error) => {
        console.log(error);

        if (error.status == 200) {
          this.empPopUpMsg= "Employee added Successfully.";
          this.isSuccess = true;
        } else {
          // alert(error.error);
        }
        if (error.status == 500) {
          // this.addEmployeeForm.reset();
          this.warningToastMsg = 'Employee added successfully, but unable to send email.';
          this.isToast = true;
          setTimeout(() => {
            this.isToast = false;
          }, 3000);
        }
      },
    );
    // this.addEmployeeForm.reset();
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

  fetchDesignation() {
    this.empService.getDesignation().subscribe((res: any) => {
      console.log(res);
      let check = this.addEmployeeForm.get('empRole')?.value;
      if (check == 'Level 1') {
        this.designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 1')
          .map((key) => ({ index: key, name: res[key][0] }));
        console.log(this.designation);
      } else if (check == 'Level 2') {
        this.designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 2')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else if (check == 'Level 3') {
        this.designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 3')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else if (check == 'Level 4') {
        this.designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 4')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else if (check == 'Level 5') {
        this.designation = Object.keys(res)
          .filter((key) => res[key][1] === 'Level 5')
          .map((key) => ({ index: key, name: res[key][0] }));
      } else {
        this.designation = [{ index: 0, name: 'Not Data' }];
      }
    });
  }

  verifyEmailId(data: any) {
    console.log('verifyEmailId called with:', data);
    this.empService.verifyEmail(data).subscribe(
      (res) => {
        console.log("Email Response:",res);
        this.isVerifiedEmail = true;
      },
      (error) => {
        if (error.status == 208) {
          console.log("Email error response:",error);
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
        this.isPhoneNo = true;
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
