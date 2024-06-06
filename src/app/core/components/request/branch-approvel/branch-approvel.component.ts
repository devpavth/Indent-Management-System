import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-branch-approvel',
  templateUrl: './branch-approvel.component.html',
  styleUrl: './branch-approvel.component.css',
})
export class BranchApprovelComponent implements OnInit {
  isProcess = true;
  isCompleted = false;
  isRejected = false;
  isViewReq = false;
  branch = sessionStorage.getItem('branchId');

  reqId: any;
  showBranch: number = 0;
  _yourReq: any;
  constructor(private rService: RequestService) {}
  ngOnInit() {
    this.fetchRequestList();
  }

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.rService.branchRequestList(status, this.branch).subscribe(
        (res) => {
          console.log('jagan', res);
          this._yourReq = res;
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
    if (
      this.isProcess == false &&
      this.isCompleted == true &&
      this.isRejected == false
    ) {
      let status = 202;
      this.rService.branchRequestList(status, this.branch).subscribe(
        (res) => {
          console.log('jagan', res);
          this._yourReq = res;
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
    if (
      this.isProcess == false &&
      this.isCompleted == false &&
      this.isRejected == true
    ) {
      let status = 406;
      this.rService.branchRequestList(status, this.branch).subscribe(
        (res) => {
          console.log('jagan', res);
          this._yourReq = res;
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
  }

  viewRequest(data: any) {
    this.isViewReq = true;
    console.log(data);
    this.reqId = data;
    this.showBranch = 2;
  }
  closeView(data: boolean) {
    this.isViewReq = data;
    this.fetchRequestList();
  }
}
