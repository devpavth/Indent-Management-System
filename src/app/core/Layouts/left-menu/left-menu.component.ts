import { Component, inject } from '@angular/core';
import { EmployeeServiceService } from '../../components/service/Employee/employee-service.service';
import { AuthService } from '../../components/service/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css',
})
export class LeftMenuComponent {
  viewRequestlist: boolean = true;
  tRequest: boolean = false;
  tAdmin: boolean = false;
  procurement: boolean = false;
  poapproval: boolean = false;
  finance: boolean = false;
  transaction: boolean = false;
  report: boolean = false;
  product: boolean = false;
  branch: boolean = false;
  employee: boolean = false;
  company: boolean = false;

  showPrefix: boolean = false;
  isAuthorized: boolean = false;
  isAuthenticateUser: boolean = false;
  isAuthenticatePgrmManager: boolean = false;
  isAuthenticateBranchManager: boolean = false;
  isAuthenticateAdmin: boolean = false;

  employeeService = inject(EmployeeServiceService);
  authService = inject(AuthService);
  route = inject(Router);

  user: any;
  userData: any;
  isLevelView: boolean = true;
  isBlockRequest: boolean = false;
  isBlockUser: boolean = true;
  isAccessUserFinance: boolean = false;

  ngOnInit() {
    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.employeeService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log('this.userData:', this.userData);
        console.log(
          'this.userData with empRole:',
          typeof this.userData.empRole,
        );

        // if(this.userData.empDesig !== 15){
        //   console.log("logging");
        //   this.isLevelView = false;
        // }else{
        //   this.isBlockRequest = true;
        // }

        // if(this.userData.empDesig !== 10){
        //   this.isBlockUser = false;
        // }

        // sessionStorage.setItem('branchId', this.userData.branchCode);
      });

      const user = this.authService.getUserRoles();
      console.log('getting user roles:', user);
      if (user.includes('ROLE_IT_ADMIN')) {
        console.log('User is authorized.');
        this.isAuthorized = true;
      } else {
        // this.route.navigate(['/home/unauth']);
        this.isAuthorized = false;
      }
    }

    this.isAuthenticatePgrmManager =
      this.authService.isAuthenticateProgramManager();
    this.isAuthenticateBranchManager =
      this.authService.isAuthenticateBranchManager();
    this.isAuthenticateAdmin = this.authService.isAuthenticateAdmin();
    this.isAuthenticateUser = this.authService.isAuthenticateUser();

    // const roleString = sessionStorage.getItem('roles');
    // const roles: string[] = roleString ? JSON.parse(roleString) : [];
    // console.log('role:', roles);
    // console.log('role:', typeof roles);

    // if (roles.includes('ROLE_USER')) {
    //   console.log('checking user role.');
    //   this.isAccessUserFinance = true;
    // }
  }

  toggleRequest() {
    this.tRequest = !this.tRequest;
    if (this.tRequest) {
      this.tAdmin = false;
      this.transaction = false;
      this.finance = false;
      this.procurement = false;
      this.poapproval = false;
      this.report = false;
    }
  }

  toggleFinance() {
    this.finance = !this.finance;
    if (this.finance) {
      this.tRequest = false;
      this.tAdmin = false;
      this.transaction = false;
      this.procurement = false;
      this.poapproval = false;
      this.report = false;
    }
  }

  toggleProcurement() {
    this.procurement = !this.procurement;
    if (this.procurement) {
      this.tRequest = false;
      this.tAdmin = false;
      this.transaction = false;
      this.finance = false;
      this.poapproval = false;
      this.report = false;
    }
  }

  toggleFinalApproval() {
    this.poapproval = !this.poapproval;
    if (this.poapproval) {
      this.tRequest = false;
      this.tAdmin = false;
      this.transaction = false;
      this.finance = false;
      this.procurement = false;
      this.report = false;
    }
  }

  toggleAdmin() {
    this.tAdmin = !this.tAdmin;
    if (this.tAdmin) {
      this.tRequest = false;
      this.transaction = false;
      this.finance = false;
      this.procurement = false;
      this.poapproval = false;
      this.report = false;
    }
  }

  toggleCompany() {
    this.company = !this.company;
    if (this.company) {
      this.employee = false;
      this.product = false;
      this.branch = false;
    }
  }

  toggleEmployee() {
    this.employee = !this.employee;
    if(this.employee){
      this.company = false;
      this.product = false;
      this.branch = false;
    }
  }

  toggleProduct() {
    this.product = !this.product;
    if(this.product){
      this.employee = false;
      this.company = false;
      this.branch = false;
    }
  }
  toggleBranch() {
    this.branch = !this.branch;
    if(this.branch){
      this.product = false;
      this.employee = false;
      this.company = false;
    }
  }

  toggleTransaction() {
    this.transaction = !this.transaction;
    if (this.transaction) {
      this.tAdmin = false;
      this.tRequest = false;
      this.procurement = false;
      this.poapproval = false;
      this.report = false;
      this.finance = false;
    }
  }

  toggleReport() {
    this.report = !this.report;
    if (this.report) {
      this.tAdmin = false;
      this.tRequest = false;
      this.procurement = false;
      this.poapproval = false;
      this.transaction = false;
      this.finance = false;
    }
  }

  openPrefix() {
    this.showPrefix = true;
    console.log('clicking the prefix.');
  }

  closePrefix() {
    this.showPrefix = false;
  }
}
