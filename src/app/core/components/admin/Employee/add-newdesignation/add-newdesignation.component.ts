import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { LevelMapping } from '../../../../models/designationRoleMapping/designation-role-mapping.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-newdesignation',
  templateUrl: './add-newdesignation.component.html',
  styleUrl: './add-newdesignation.component.css',
})
export class AddNewdesignationComponent {
  @Output() close = new EventEmitter<boolean>();

  employeeService = inject(EmployeeServiceService);
  route = inject(Router);
  levelForDesignation: LevelMapping[] = [];

  selectedLevelId: number = 0;
  empDesignation: string = '';
  isToast: boolean = false;
  successToastMsg: string = '';
  isDeleteToast: boolean = false;
  errorToastMsg: string = '';
  isViewAddNewLevel: boolean = false;

  ngOnInit() {
    this.fetchLevelForDesignation();
  }

  fetchLevelForDesignation() {
    this.employeeService.fetchLevelForDesignation().subscribe(
      (res) => {
        console.log('fetching level for new designation:', res);
        this.levelForDesignation = res;
      },
      (error) => {
        console.log('error while fetching level for new designation:', error);
      },
    );
  }

  selectedLevelName(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLevelId = Number(selectElement.value);

    console.log('this.selectedLevelId:', this.selectedLevelId);
  }

  postNewDesignation(DesignName: string) {
    console.log('DesignName:', DesignName);
    this.employeeService
      .postNewDesignation(this.selectedLevelId, DesignName)
      .subscribe(
        (res: any) => {
          console.log('posting new desgination:', res);
          this.isToast = true;
          this.successToastMsg = res.errorMessege;
          setTimeout(() => {
            this.isToast = false;
            this.close.emit(true);
            this.route.navigate(['/home/designationRoleMapping']);
          }, 3000);
        },
        (error) => {
          console.log('error while posting new desgination:', error);
          this.isDeleteToast = true;
          this.errorToastMsg = error.error;
          setTimeout(() => {
            this.isDeleteToast = false;
          }, 3000);
        },
      );
  }

  addNewLevel() {
    this.isViewAddNewLevel = true;
  }

  closePopUp() {
    this.close.emit(true);
  }

  closeNewLevel(closeIcon: boolean){
    this.isViewAddNewLevel = !closeIcon;
  }
}
