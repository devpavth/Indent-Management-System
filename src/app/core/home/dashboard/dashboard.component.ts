import { Component, OnInit, inject } from '@angular/core';
import { SharedServiceService } from '../../components/service/shared-service/shared-service.service';
import { EmployeeServiceService } from '../../components/service/Employee/employee-service.service';
import { Employeedetails } from '../../models/employee/employeedetails.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userId: string | null = '';
  isViewUploadSignature: boolean = false;
  employeeDetails: Employeedetails | undefined;
  specialRoleId: number = 0;

  constructor(public readonly shared: SharedServiceService) {}

  empService = inject(EmployeeServiceService);

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    this.empService.getEmployeeDetails(this.userId).subscribe(
      (res: Employeedetails) => {
        console.log('fetching employee details:', res);
        this.employeeDetails = res;

        this.specialRoleId = this.employeeDetails.specialRoleId;

        if (
          this.employeeDetails.specialRoleId &&
          !this.employeeDetails.signUploaded
        ) {
          this.isViewUploadSignature = true;
        }
      },
      (error) => {
        console.log('error while fetching employee details:', error);
      },
    );

    
  }

  clearUploadSignature(closeIcon: boolean) {
    this.isViewUploadSignature = !closeIcon;
  }
}
