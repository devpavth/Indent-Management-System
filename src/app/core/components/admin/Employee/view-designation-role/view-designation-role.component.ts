import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from '../../../service/Branch/branch.service';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import {
  DesignationRoleMapping,
  RoleMapping,
} from '../../../../models/designationRoleMapping/designation-role-mapping.model';

@Component({
  selector: 'app-view-designation-role',
  templateUrl: './view-designation-role.component.html',
  styleUrl: './view-designation-role.component.css',
})
export class ViewDesignationRoleComponent {
  @Input() Id: number | undefined;
  @Output() closeUpdate = new EventEmitter<boolean>();
  designation: string = '';
  levelName: string = '';
  levelId: number = 0;
  roleId: number = 0;
  designationId: number = 0;
  popupMessage: string = '';
  confirmAction: () => void = () => {};
  selectedRole!: RoleMapping;
  selectedRoleName: string = '';
  activeRoleMapping: RoleMapping[] = [];
  designationRoleList: DesignationRoleMapping | undefined;
  // isAssigned: boolean = false;
  projectList: any;
  project: any;
  activeLink: any;
  // ActiveId = inject(ActivatedRoute);
  branchService = inject(BranchService);
  private fb = inject(FormBuilder);

  designationRole: RoleMapping[] = [];

  isToast: boolean = false;
  deleteToastMsg: any;
  employeeService = inject(EmployeeServiceService);
  isWarningPopup: boolean = false;
  isUpdateLevelView: boolean = false;
  isDeleteToast: boolean = false;
  errorToastMsg: string = '';
  visibleTooltipIndex: number | null = null;

  constructor() {}

  ngOnInit(): void {
    // this.activeLink = this.ActiveId.snapshot.paramM ap.get('id');
    console.log('this.activeLink:', this.activeLink);
    console.log('this.Id:', this.Id);
    // this.fetchProgram();
    // this.fetchDepartment();
    // this.fetchDepartmentdata();
    this.fetchDesignationRole();
    this.fetchDesignationAssignedRole();
  }

  fetchDesignationRole() {
    this.employeeService.getDesignationRole().subscribe(
      (res: RoleMapping[]) => {
        console.log('fetching designation role:', res);
        this.designationRole = res;
        this.designationRole = this.designationRole.map((role) => ({
          ...role,
          roleName: role.roleName.replace(/_/g, ' '),
        }));

        console.log('Updated designationRole:', this.designationRole);
      },
      (error) => {
        console.log('error while fetching designation role:', error);
      },
    );
  }

  toggleTooltip(index: number, event: Event) {
    event.stopPropagation();
    this.visibleTooltipIndex =
      this.visibleTooltipIndex === index ? null : index;
  }

  @HostListener('document:click', ['$event'])
  closeToolTip(event: Event) {
    this.visibleTooltipIndex = null;
  }

  fetchDesignationAssignedRole() {
    this.employeeService.fetchDesignationAssignedRole(this.Id).subscribe(
      (res: DesignationRoleMapping) => {
        console.log('fetching Designation Assigned Role', res);
        this.designationRoleList = res;
        console.log('Before Update:', this.activeRoleMapping);
        this.activeRoleMapping = res.desigRoleMapping;
        console.log('After Update:', this.activeRoleMapping);
        // this.activeRoleMapping = res.desigRoleMapping;
        this.designationId = res.empDesig;
        this.designation = res.empDesignation;
        this.levelName = res.levelName;
        this.levelId = res.levelId;
      },
      (error) => {
        console.log('error while fetching Designation Assigned Role', error);
      },
    );
  }

  getLevelByColor(levelId: number): string {
    const colors = [
      'bg-red-100 rounded-xl',
      'bg-blue-100 rounded-xl',
      'bg-green-100 rounded-xl',
      'bg-yellow-100 rounded-xl',
      'bg-purple-100 rounded-xl',
      'bg-pink-100 rounded-xl',
      'bg-indigo-100 rounded-xl',
      'bg-teal-100 rounded-xl',
      'bg-orange-100 rounded-xl',
      'bg-gray-100 rounded-xl',
    ];

    return colors[levelId % colors.length];
  }

  changeLevel() {
    this.isUpdateLevelView = true;
  }

  closeUpdateLevel(closeIcon: boolean) {
    this.isUpdateLevelView = !closeIcon;
  }

  assignRoletoDesign(role: RoleMapping) {
    console.log('adding data:', role);
    this.selectedRole = role;
    this.popupMessage = `Are you sure you want to assign ${role.roleName} to ${this.designation}?`;
    this.confirmAction = () => this.assignRoletoDesignation(role);
    this.isWarningPopup = true;
  }

  assignRoletoDesignation(role: RoleMapping) {
    console.log('role', role);

    if (this.Id === undefined) {
      console.log('Error: Designation ID is undefined');
      return;
    }

    // this.activeRoleMapping.push(role);

    this.employeeService.assigningRoleToDesignation(this.Id, role.id).subscribe(
      (res: any) => {
        console.log('Role Assigned to The Position:', res);
        // this.isAssigned = true;
        this.fetchDesignationRole();
        this.fetchDesignationAssignedRole();
        this.isWarningPopup = false;
        this.isToast = true;
        this.deleteToastMsg = res.errorMessege;
        setTimeout(() => {
          this.isToast = false;
          this.closeUpdate.emit(false);
        }, 3000);
      },
      (error) => {
        console.log('error while posting assigned role to design:', error);
        this.activeRoleMapping = this.activeRoleMapping.filter(
          (r) => r.id !== role.id,
        );
        if (error.status === 417) {
          this.isWarningPopup = false;
          this.isDeleteToast = true;
          this.errorToastMsg = error.error;
          setTimeout(() => {
            this.isDeleteToast = false;
          }, 3000);
        }
      },
    );
  }

  closepop(data: boolean) {
    this.isWarningPopup = data;
  }

  // fetchDepartment() {
  //   this.branchService.getAllProj().subscribe((res: any) => {
  //     console.log('fetching all departments:', res);
  //     this.projectList = res;
  //   });
  // }
  // fetchProgram() {
  //   this.branchService.editProj(this.Id).subscribe((res) => {
  //     console.log(res);
  //   });
  // }
  onSubmitProj() {
    throw new Error('Method not implemented.');
  }

  // assignRoletoDesign(data: any) {
  //   console.log('adding data:', data);
  //   let formateData = {
  //     departProgram: [
  //       {
  //         programId: data.programId,
  //       },
  //     ],
  //   };

  //   console.log('formateData:', formateData);

  //   this.branchService.updateAssignProj(this.Id, formateData).subscribe(
  //     (res: any) => {
  //       console.log('updating department:', res);
  //       this.isToast = true;
  //       this.deleteToastMsg = res.error;
  //       setTimeout(() => {
  //         this.isToast = false;
  //       }, 3000);
  //       // this.check();
  //       // this.fetchDepartment();
  //       // this.fetchDepartmentdata();
  //     },
  //     (error) => {
  //       console.log('error while updating the program data', error);
  //     },
  //   );
  // }

  deleteRoleFromDesignation(role: any) {
    console.log('deleting data:', role);

    this.popupMessage = `Are you sure you want to remove ${role.roleName} from ${this.designation}?`;
    this.confirmAction = () => this.removeAssignedRole(role);
    this.isWarningPopup = true;
  }

  removeAssignedRole(role: RoleMapping) {
    console.log("removing selected role:", role);

    this.employeeService.removeRoleFromDesignation(this.Id, role.id).subscribe(
      (res: any) =>{
        console.log("successfully removing the role from designation:", res);
        this.isToast = true;
        this.deleteToastMsg = res.errorMessege;
        this.isWarningPopup = false;
        this.fetchDesignationRole();
        this.fetchDesignationAssignedRole();
        setTimeout(() => {
          this.isToast = false;
          this.closeUpdate.emit(false);
        }, 3000);
      },
      (error) => {
        console.log('error while removing role from designation', error);
      }
    )
  }

  // fetchDepartmentdata() {
  //   this.branchService.getActiveProgram(this.Id).subscribe((res: any) => {
  //     console.log('fetching department program:', res);
  //     this.program = res.departProgram;
  //     this.department = res.departName;
  //   });
  // }
  check(role: string): any {
    // console.log(role);

    const formattedRole = role.replace(/\s+/g, '_');

    return this.activeRoleMapping.find((r) => r.roleName === formattedRole);
  }
}
