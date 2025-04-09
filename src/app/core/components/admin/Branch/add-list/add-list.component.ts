import { Component, inject, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css',
})
export class AddListComponent implements OnInit {
  department: any;
  project: any;
  assProjList: any[] = [];
  projectList: any[] = [];

  assProjListIds: any;
  activeLink: any;

  route = inject(Router);
  toastService =  inject(ToastService);

  isDeleteToast: boolean = false;
  errorToastMsg: string = '';
  isToast: boolean = false;
  successToastMsg: string = '';

  constructor(
    private branchService: BranchService,
    private activeLinkId: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.fetchProject();

    this.activeLink = this.activeLinkId.snapshot.paramMap.get('id');
  }

  fetchProject() {
    this.branchService.getAllProj().subscribe((res: any) => {
      console.log(res);
      this.projectList = res;
    });
  }

  addProject(project: any) {
    // console.log(project);
    this.assProjList.push({ programId: project, programStatus: 200 });
    this.assProjListIds = this.assProjList.map((item) => item.programId);
    console.log('this.assProjList:', this.assProjList);

    this.toastService.showSuccess('Program Added Successfully');
    setTimeout(() => {
      this.isToast = false;
    }, 3000);
  }

  showSuccessToast() {
    if (!this.assProjListIds && this.department) {
 
      this.toastService.showSuccess(
        `Please assign atleast one program to ${this.department} department`,
      );
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
    }
  }

  deleteProject(programId: any) {
    console.log(programId);

    const index = this.assProjList.findIndex(
      (item) => item.programId === programId,
    );
    if (index !== -1) {
      this.assProjList.splice(index, 1);

      this.assProjListIds = this.assProjList.map((item) => item.programId);

      console.log(this.assProjList);
    } else {
      console.log('Program ID not found in the list');
    }
  }

  onSubmit() {
    let departList = {
      departName: this.department,
      departProgram: this.assProjList,
    };
    console.log('departList:', departList);
    this.branchService.addNewDepart(departList).subscribe(
      (res: any) => {
        console.log('adding department name:', res);

        this.toastService.showSuccess(res.error);
        setTimeout(() => {
          this.isToast = false;
          this.route.navigate(['/home/viewList/1']);
        }, 3000);
      },
      (error) => {
        console.log('error adding department name:', error);
        this.isDeleteToast = true;
        this.errorToastMsg = error.error[0];
        setTimeout(() => {
          this.isDeleteToast = false;
        }, 3000);
      },
    );
  }

  onSubmitProj() {
    console.log(this.project);
    this.branchService.addNewProj({ proName: this.project }).subscribe(
      (res: any) => {
        console.log('successfully added program:', res);
        this.toastService.showSuccess(res.error);

        setTimeout(() => {
          this.route.navigate(['/home/viewList/2']);
        }, 3000);
      },
      (error) => {
        console.log('error while adding program:', error);
      },
    );
  }
}
