import { Component, inject } from '@angular/core';
import { EmployeeServiceService } from '../../components/service/Employee/employee-service.service';

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

  employeeService = inject(EmployeeServiceService);
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
    }

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

  toggleEmployee(){
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
}
