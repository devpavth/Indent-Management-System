import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.css',
})
export class EditListComponent implements OnInit {
  @Input() Id: any;
  @Output() closeUpdate = new EventEmitter<boolean>();
  department: any;
  projectList: any;
  project: any;
  activeLink: any;
  ActiveId = inject(ActivatedRoute);
  branchService = inject(BranchService);
  private fb = inject(FormBuilder);
  program: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.activeLink = this.ActiveId.snapshot.paramMap.get('id');
    console.log(this.activeLink);
    console.log(this.Id);
    // this.fetchProgram();
    this.fetchDepartment();
    this.fetchDepartmentdata();
  }
  fetchDepartment() {
    this.branchService.getAllProj().subscribe((res: any) => {
      console.log(res);
      this.projectList = res;
    });
  }
  // fetchProgram() {
  //   this.branchService.editProj(this.Id).subscribe((res) => {
  //     console.log(res);
  //   });
  // }
  onSubmitProj() {
    throw new Error('Method not implemented.');
  }

  assignProjtoDept(data: any) {
    console.log(data);
    let formateData = {
      departProgram: [
        {
          programId: data.programId,
        },
      ],
    };

    this.branchService
      .updateAssignProj(this.Id, formateData)
      .subscribe((res) => {
        console.log(res);
      });
    this.fetchDepartment();
    this.fetchDepartmentdata();
  }

  fetchDepartmentdata() {
    this.branchService.getActiveProgram(this.Id).subscribe((res: any) => {
      console.log(res);
      this.program = res.departProgram;
      this.department = res.departName;
    });
  }
  check(id: any) {
    console.log(this.program.find((data) => data.programId == id));

    return this.program.find((data) => data.programId == id);
  }
}
