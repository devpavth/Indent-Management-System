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
  isToast: boolean = false;
  deleteToastMsg: any;

  constructor() {}

  ngOnInit(): void {
    this.activeLink = this.ActiveId.snapshot.paramMap.get('id');
    console.log("this.activeLink:", this.activeLink);
    console.log("this.Id:", this.Id);
    // this.fetchProgram();
    this.fetchDepartment();
    this.fetchDepartmentdata();
  }
  fetchDepartment() {
    this.branchService.getAllProj().subscribe((res: any) => {
      console.log("fetching all departments:", res);
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
    console.log("adding data:", data);
    let formateData = {
      departProgram: [
        {
          programId: data.programId,
        },
      ],
    };

    console.log("formateData:", formateData);

    this.branchService
      .updateAssignProj(this.Id, formateData)
      .subscribe((res: any) => {
        console.log("updating department:", res);
        this.isToast = true
        this.deleteToastMsg = res.error;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        // this.check();
        this.fetchDepartment();
        this.fetchDepartmentdata();
      },
      (error) => {
        console.log("error while updating the program data", error);
      }
    );
  }

  deleteDeptProgram(data: any){
    console.log("deleting data:", data);

    // let formateData = {
    //   departProgram: [
    //     {
    //       programId: data.programId,
    //     },
    //   ],
    // };

    // console.log("formateData:", formateData);

    this.branchService.deleteDepartmentProgram(this.Id, data.programId).subscribe(
      (res: any) => {
        console.log("successfully deleted the program:", res);
        this.isToast = true
        this.deleteToastMsg = res.error;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        this.fetchDepartment();
        this.fetchDepartmentdata();
        !this.check(data.programId);
      },
      (error) => {
        console.log("error while deleting the program data", error);
      }
    )
  }

  fetchDepartmentdata() {
    this.branchService.getActiveProgram(this.Id).subscribe((res: any) => {
      console.log("fetching department program:", res);
      this.program = res.departProgram;
      this.department = res.departName;
    });
  }
  check(id: any) {
    // console.log("this.program.find((data) => data.programId == id):", this.program.find((data) => data.programId == id));

    return this.program.find((data) => data.programId == id);
  }
}
