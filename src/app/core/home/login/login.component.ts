import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../components/service/Auth/auth.service';
import { BranchService } from '../../components/service/Branch/branch.service';
import { Company } from '../../models/company/company.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  window: any;

  branchService = inject(BranchService);

  companyDetails: Company | undefined;

  constructor(
    private Router: Router,
    private readonly auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.loginForm.get('empPassword')?.disable();
    if (sessionStorage.getItem('userId')) {
      this.Router.navigate(['home/dashboard']);
    }
  }
  //login data name declare
  userData: any;
  userid: any;
  branchid: any;
  userRole: string = '';

  isPasswordHidden = true; //password visiable
  passwordEnabled: boolean = false; //password enable

  // error mesg
  isVerfied: number = 0;
  passwordVerified: number = 0;

  loginForm = new FormGroup({
    employeeId: new FormControl('', [Validators.required]),
    empPassword: new FormControl('', [Validators.required]),
  });
  toggle() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  verifiedUser(id: any) {
    // console.log(id);

    this.auth.verifiedID(id).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status === 302) {
          this.isVerfied = 302;
          this.loginForm.get('empPassword')?.enable();
          this.passwordEnabled = true;
        }
        if (error.status === 404) {
          this.isVerfied = 404;
          this.passwordEnabled = false;
          this.loginForm.get('empPassword')?.disable();
        }
        if (error.status === 0) {
          console.log('offline');
          this.Router.navigate(['networkerror']);
        }
      },
    );
  }
  login(loginData: any) {
    console.log('login data', loginData);

    this.userData = loginData;
    this.auth.login(loginData).subscribe(
      (res) => {
        this.userData = res;
        // console.log(res);

        if (res != null) {
          this.userid = this.userData?.employeeId;
          this.userRole = this.userData?.roles;
          console.log('this.userRole:', this.userRole);
          console.log('this.userRole:', typeof this.userRole);

          sessionStorage.setItem('userId', this.userid);
          sessionStorage.setItem('token', this.userData.token);
          sessionStorage.setItem('roles', JSON.stringify(this.userRole));

          this.fetchCompanyDetails();

          // this.Router.navigate(['home/dashboard']);

          console.log(this.userData);
        } else {
          // alert('error');
          this.passwordVerified = 1;
        }
      },
      (error) => {
        if (error.status == 403) {
          this.passwordVerified = 1;
        }
        if (error.status === 0) {
          console.log('offline');
        }
      },
    );
  }

  fetchCompanyDetails() {
    this.branchService.fetchCompanyName().subscribe(
      (res) => {
        console.log('fetching company details:', res);
        this.companyDetails = res;
        
        sessionStorage.setItem('companyName', this.companyDetails.companyName);

        if (this.companyDetails.companyLogo) {
          console.log("Company Logo before storing:", this.companyDetails.companyLogo);
          sessionStorage.setItem('companyLogo', this.companyDetails.companyLogo);
        }

        this.Router.navigate(['home/dashboard']);
        
        // sessionStorage.setItem('companyLogo', this.companyDetails.companyLogo);
        // this.Spinner = false;
      },
      (error) => {
        console.log('error while fetching company details:', error);
      },
    );
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }
}