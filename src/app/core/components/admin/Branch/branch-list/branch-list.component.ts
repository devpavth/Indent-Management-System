import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.css',
})
export class BranchListComponent implements OnInit {
  _branch: any;
  branchCode: any;
  isSuccess: boolean = false;
  // userid: any = this.userdata.loginUserData.sno

  isAuth: boolean = false;
  constructor(
    private branchService: BranchService,
    private userdata: SharedServiceService,
  ) {}

  ngOnInit() {
    this.fetchAllBranch();
  }

  isViewBranch: boolean = false;

  fetchAllBranch() {
    this.branchService.getAllBranch().subscribe(
      (res) => {
        console.table(res);

        this._branch = res;
      },
      (error) => {
        if (error.status == 403) {
          this.isAuth = true;
        }
      },
    );
  }
  viewBranch(data: any) {
    console.log(data);
    this.isViewBranch = true;
    this.branchCode = data;
    console.log(this.branchCode);
  }
  closeViewBranch(event: any) {
    this.isViewBranch = event;
  }
  closeSuccessPop(event: any) {
    this.isSuccess = event;
    this.isViewBranch = false;
  }
}
