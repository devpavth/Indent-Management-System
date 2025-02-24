import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { LevelMapping } from '../../../../models/designationRoleMapping/designation-role-mapping.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updatelevel-fordesignation',
  templateUrl: './updatelevel-fordesignation.component.html',
  styleUrl: './updatelevel-fordesignation.component.css',
})
export class UpdatelevelFordesignationComponent {
  @Input() designationId: number | undefined;
  @Input() initialLevelId: number | undefined;
  @Output() close = new EventEmitter<boolean>();

  levelForDesignation: LevelMapping[] = [];

  selectedLevelId: number | undefined = 0;
  isToast: boolean = false;
  successToastMsg: string = '';
  storeLevel: boolean = false;

  employeeService = inject(EmployeeServiceService);
  route = inject(Router);

  ngOnInit() {
    console.log('this.initialLevelId (Before Fetch):', this.initialLevelId);
    console.log(
      'this.initialLevelId (Before Fetch):',
      typeof this.initialLevelId,
    );
    // this.selectedLevelId = this.initialLevelId;
    this.fetchLevelForDesignation();
  }


  selectLevelToUpdate(event: Event) {
    console.log('Initial Level ID before:', this.initialLevelId);
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLevelId = Number(selectElement.value);

    console.log('Selected Level ID:', this.selectedLevelId);
    console.log('Initial Level ID:', this.initialLevelId);
    console.log(
      'Comparison Result:',
      this.initialLevelId === this.selectedLevelId,
    );
    this.storeLevel = this.initialLevelId === this.selectedLevelId;
    console.log('this.storeLevel:', this.storeLevel);
  }

  fetchLevelForDesignation() {
    this.employeeService.fetchLevelForDesignation().subscribe(
      (res) => {
        console.log('fetching level to change:', res);
        this.levelForDesignation = res;
      },
      (error) => {
        console.log('error while fetching level:', error);
      },
    );
  }

  updateLevel() {
    this.employeeService
      .updateLevelForDesignation(this.selectedLevelId, this.designationId)
      .subscribe(
        (res: any) => {
          console.log('successfully updated the level:', res);
          this.isToast = true;
          this.successToastMsg = res.errorMessege;
          setTimeout(() => {
            this.isToast = false;
            this.route.navigate(['/home/designationRoleMapping']);
          }, 3000);
        },
        (error) => {
          console.log('error while updating the level:', error);
        },
      );
  }

  closePopUp() {
    this.close.emit(true);
  }
}
