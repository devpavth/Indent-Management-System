import { Component } from '@angular/core';
import { EmployeeServiceService } from '../../core/components/service/Employee/employee-service.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  userId: any; //userId
  userDetail: any; //user details
  date: any = new Date();
  constructor(private readonly userDetailService: EmployeeServiceService) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.userDetailService.getEmployeeDetails(this.userId).subscribe((res) => {
      this.userDetail = res;
    });
  }
}
