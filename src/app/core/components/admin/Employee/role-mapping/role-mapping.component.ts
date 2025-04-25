import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { BranchService } from '../../../service/Branch/branch.service';
import { ProductService } from '../../../service/Product/product.service';
import {
  DesignationRoleMapping,
  LevelMapping,
} from '../../../../models/designationRoleMapping/designation-role-mapping.model';

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrl: './role-mapping.component.css',
})
export class RoleMappingComponent {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  listLength: any;

  // headOfAccList: any[] = [];
  levelDesignationList: LevelMapping[] | undefined;
  designationRoleList: DesignationRoleMapping[] | undefined;
  isViewAddNewDesignation: boolean = false;
  sortLevelInAscending: boolean = true;
  isSkeletonLoader: boolean = true;
  noDesignation: boolean = false;

  employeeService = inject(EmployeeServiceService);

  // activeId: any;
  isDelete: boolean = false;
  isUpdate: boolean = false;
  deleteItem: { title: string; action: number; deleteId: any } = {
    title: '',
    action: 0,
    deleteId: undefined,
  };

  updateId: number = 0;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private activeLinkId: ActivatedRoute,
    private branchService: BranchService,
  ) {}
  ngOnInit() {
    // this.activeId = this.activeLinkId.snapshot.paramMap.get('id');
    // console.log(this.activeId);
    // this.fetchDepartNProj();
    this.fetchDesignationRole();
    // this.fetchLevelForDesignation();
  }

  addNewDesignation() {
    this.isViewAddNewDesignation = true;
  }

  closeNewDesignation(closeIcon: boolean) {
    this.isViewAddNewDesignation = !closeIcon;
  }

  fetchDesignationRole() {
    this.employeeService.getDesignationRoleMapping().subscribe(
      (res: DesignationRoleMapping[]) => {
        console.log('fetching designation details:', res);
        this.designationRoleList = res;
        this.isSkeletonLoader = false;
        this.noDesignation = false;
      },
      (error) => {
        console.log('error while fetching designation:', error);
        this.isSkeletonLoader = false;

        if (error.status === 404) {
          this.noDesignation = true;
        }
      },
    );
  }

  sortByLevel() {
    this.sortLevelInAscending = !this.sortLevelInAscending;

    this.designationRoleList?.sort((a, b) => {
      return this.sortLevelInAscending
        ? a.levelId - b.levelId
        : b.levelId - a.levelId;
    });
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

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    // this.fetchDepartNProj();
  }
  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
  get startPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.listLength);
  }

  toggledelete(check: any, isView: boolean, Id: any) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteItem = {
        title: 'Department',
        action: 4,
        deleteId: Id,
      };
      console.log(this.deleteItem);
    } else if (check == 2) {
      this.isDelete = isView;
      this.deleteItem = {
        title: 'Project/Program',
        action: 5,
        deleteId: Id,
      };
      console.log(this.deleteItem);
    } else if (check == 0) {
      this.isDelete = isView;
      // this.fetchDepartNProj();
    }
  }

  update(id: any, isUpdate: boolean) {
    console.log(id);
    this.updateId = id;
    this.isUpdate = isUpdate;
  }
}
