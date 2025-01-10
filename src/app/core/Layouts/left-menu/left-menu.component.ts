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
  product: boolean = false;
  branch: boolean = false;

  employeeService = inject(EmployeeServiceService);
  user: any;
  userData: any;
  isLevelView: boolean = true;

  ngOnInit(){
    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.employeeService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log("this.userData:", this.userData);
        console.log("this.userData with empRole:", typeof this.userData.empRole);

        if(this.userData.empDesig !== 15){
          console.log("logging");
          this.isLevelView = false;
        }

        // sessionStorage.setItem('branchId', this.userData.branchCode);
      });
    }
  }

  toggleRequest() {
    this.tRequest = !this.tRequest;
  }
  toggleAdmin() {
    this.tAdmin = !this.tAdmin;
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
