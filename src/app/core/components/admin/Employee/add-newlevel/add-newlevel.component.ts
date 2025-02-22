import { Component, EventEmitter, inject, Output } from '@angular/core';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-newlevel',
  templateUrl: './add-newlevel.component.html',
  styleUrl: './add-newlevel.component.css',
})
export class AddNewlevelComponent {
  @Output() close = new EventEmitter<boolean>();

  employeeService = inject(EmployeeServiceService);
  route = inject(Router);

  newLevelName: string = '';
  isToast: boolean = false;
  successToastMsg: string = '';

  ngOnInit() {
    this.fetchNewLevel();
  }

  fetchNewLevel() {
    this.employeeService.fetchNewLevel().subscribe(
      (res: any) => {
        console.log('fetching new level:', res);
        this.newLevelName = res.levelName;
      },
      (error) => {
        console.log('error while fetching new level:', error);
      },
    );
  }

  confirmNewLevel() {
    this.employeeService.confirmNewLevel().subscribe(
      (res: any) => {
        console.log('confirm new level:', res);
        this.isToast = true;
        this.successToastMsg = res.errorMessege;
        setTimeout(() => {
          this.isToast = false;
          this.route.navigate(['/home/designationRoleMapping']);
        }, 3000);
      },
      (error) => {
        console.log('error while confirming new level:', error);
      },
    );
  }

  closePopUp() {
    this.close.emit(true);
  }
}
