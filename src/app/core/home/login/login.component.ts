import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../components/service/Auth/auth.service';
import { BranchService } from '../../components/service/Branch/branch.service';
import { Company } from '../../models/company/company.model';
import { EmployeeServiceService } from '../../components/service/Employee/employee-service.service';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  window: any;

  branchService = inject(BranchService);
  empService = inject(EmployeeServiceService);

  companyDetails: Company | undefined;
  loading: boolean = false;

  private tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;

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
  newToken: any;
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

  onEnterKey(event: Event){
    const keyboardEvent = event as KeyboardEvent;
    const passwordControl = this.loginForm.get('empPassword');
    if(!passwordControl || !passwordControl.value){
      keyboardEvent.preventDefault();
    }else if(this.loginForm.valid){
      this.login(this.loginForm.value);
    }
  }

  login(loginData: any) {
    console.log('login data', loginData);

    this.userData = loginData;

    this.loading = true;

    this.auth.login(loginData).subscribe(
      (res) => {
        this.userData = res;

        if (res != null) {
          this.userid = this.userData?.employeeId;
          this.userRole = this.userData?.roles;
          console.log('this.userRole:', this.userRole);
          console.log('this.userRole:', typeof this.userRole);

          if (this.userData.access_token) {
            const accessExpiresIn = this.userData.expires_in * 1000;
            const refreshExpiresIn = this.userData.refresh_expires_in * 1000;

            console.log('expiresIn:', accessExpiresIn);
            console.log('refreshExpiresIn:', refreshExpiresIn);

            sessionStorage.setItem('userId', this.userid);
            sessionStorage.setItem('access_token', this.userData.access_token);
            sessionStorage.setItem(
              'refresh_token',
              this.userData.refresh_token,
            );

            this.startTokenRefreshCycle(accessExpiresIn, refreshExpiresIn);
          } else {
            console.log('token is expired else part.');
          }

          // sessionStorage.setItem('roles', JSON.stringify(this.userRole));

          this.fetchProfile();

          // this.Router.navigate(['home/dashboard']);

          console.log('login credentials:', this.userData);
        } else {
          this.passwordVerified = 1;
        }
      },
      (error) => {
        this.loading = false;
        if (error.status == 401) {
          this.passwordVerified = 1;
        }
        if (error.status === 0) {
          console.log('offline');
        }
      },
    );
  }

  startTokenRefreshCycle(accessExpiresIn: number, refreshExpiresIn: number) {
    console.log('expiresIn in startTokenRefreshCycle:', accessExpiresIn);

    // if(this.tokenRefreshInterval){
    //   clearInterval(this.tokenRefreshInterval);
    // }

    setInterval(() => {
      console.log('Access Session expired, logging out...');
      this.fetchNewAccessToken();
      this.tokenRefreshInterval = setInterval(() => {
        console.log('Session expired, logging out...');
        this.fetchNewAccessToken();
      }, refreshExpiresIn - accessExpiresIn);
    }, accessExpiresIn);
  }

  // ngOnDestroy(): void{
  //   if(this.tokenRefreshInterval){
  //     clearInterval(this.tokenRefreshInterval);
  //   }
  //   console.log('Token refresh interval cleared!');
  // }

  fetchProfile() {
    this.empService.fetchEmployeeProfileDetails().subscribe(
      (res: any) => {
        console.log('fetching profile details:', res);

        if (res?.desigRoleMapping) {
          const roleNames = res?.desigRoleMapping.map(
            (role: { roleName: string }) => role.roleName,
          );

          sessionStorage.setItem('roles', JSON.stringify(roleNames));

          console.log('Stored roles in sessionStorage:', roleNames);

          this.fetchCompanyDetails();
        }
      },
      (error) => {
        console.log('error while fetching profile details:', error);
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
          // console.log("Company Logo before storing:", this.companyDetails.companyLogo);
          sessionStorage.setItem(
            'companyLogo',
            this.companyDetails.companyLogo,
          );
        }

        this.loading = false;

        this.Router.navigate(['home/dashboard']);
      },
      (error) => {
        console.log('error while fetching company details:', error);
      },
    );
  }

  fetchNewAccessToken() {
    this.empService.fetchNewAccessToken().subscribe(
      (res) => {
        console.log('successfully fecthing new access token:', res);
        this.newToken = res;
        sessionStorage.setItem('access_token', this.newToken.access_token);
        console.log(this.newToken.access_token);
        sessionStorage.setItem('refresh_token', this.newToken.refresh_token);
        console.log('new refresh token:', this.newToken.refresh_token);
      },
      (error) => {
        console.log('error while fetching new access token:', error);
      },
    );
  }

  logout() {
    sessionStorage.clear();
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('access_token');
    console.log('Session expired. Logging out...');
    this.Router.navigate(['/login']);
  }
}
