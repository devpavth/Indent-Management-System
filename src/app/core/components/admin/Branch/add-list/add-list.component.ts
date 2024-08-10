import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { ActivatedRoute } from '@angular/router';

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
    console.log(this.assProjList);
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
    console.log(departList);
    this.branchService.addNewDepart(departList).subscribe((res: any) => {
      console.log(res);
    });
  }

  onSubmitProj() {
    console.log(this.project);
    this.branchService
      .addNewProj({ proName: this.project })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
