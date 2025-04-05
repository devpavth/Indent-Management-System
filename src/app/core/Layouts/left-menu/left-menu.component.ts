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
      }else{
        // this.route.navigate(['/home/unauth']);
        this.isAuthorized = false;
      }
    }

    this.isAuthenticatePgrmManager = this.authService.isAuthenticateProgramManager();
    this.isAuthenticateBranchManager = this.authService.isAuthenticateBranchManager();
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
  }
  toggleAdmin() {
    this.tAdmin = !this.tAdmin;
  }

  toggleCompany() {
    this.company = !this.company;
  }

  toggleEmployee() {
    this.employee = !this.employee;
  }

  toggleTransaction() {
    this.transaction = !this.transaction;
  }
  toggleProduct() {
    this.product = !this.product;
  }
  toggleBranch() {
    this.branch = !this.branch;
  }

  openPrefix() {
    this.showPrefix = true;
    console.log('clicking the prefix.');
  }

  closePrefix() {
    this.showPrefix = false;
  }
}
