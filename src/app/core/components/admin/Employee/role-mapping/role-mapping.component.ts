import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';
import { BranchService } from '../../../service/Branch/branch.service';
import { ProductService } from '../../../service/Product/product.service';
import { DesignationRoleMapping } from '../../../../models/designationRoleMapping/designation-role-mapping.model';

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
  designationRoleList: DesignationRoleMapping[] | undefined;
  employeeService = inject(EmployeeServiceService);

  // activeId: any;
  isDelete: boolean = false;
  isUpdate: boolean = false;
  deleteItem: { title: string; action: number; deleteId: any } = {
    title: '',
    action: 0,
    deleteId: undefined,
  };

  updateId: any;
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
  }

  fetchDesignationRole(){
    this.employeeService.getDesignationRoleMapping().subscribe(
      (res: DesignationRoleMapping[]) => {
        console.log("fetching designation details:", res);
        this.designationRoleList = res;
      },
      (error) => {
        console.log("error while fetching designation:", error);
      }
    )
  }

  // fetchDepartNProj() {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   if (this.activeId == 1) {
  //     this.branchService.getAllDepartments().subscribe((res: any) => {
  //       console.log(res);
  //       let list: any[] = res;
  //       this.headOfAccList = list.slice(startIndex, endIndex);
  //       this.listLength = this.headOfAccList.length;
  //     });
  //   } else if (this.activeId == 2) {
  //     this.branchService.getAllProj().subscribe((res: any) => {
  //       console.log(res);

  //       this.headOfAccList = res;
  //       this.listLength = this.headOfAccList.length;
  //     });
  //   }
  // }

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
