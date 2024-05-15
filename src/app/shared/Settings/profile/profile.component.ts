import { Component, OnInit } from '@angular/core';
import { EmployeeServiceService } from '../../../core/components/service/Employee/employee-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(private readonly userDetailService: EmployeeServiceService) {}
  userId: any; //userId
  userDetail: any; //user details
  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.userDetailService.getEmployeeDetails(this.userId).subscribe((res) => {
      this.userDetail = res;
    });
  }
}
