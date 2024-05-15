import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-admin-approvel',
  templateUrl: './admin-approvel.component.html',
  styleUrl: './admin-approvel.component.css',
})
export class AdminApprovelComponent implements OnInit {
  isProcess = true;
  isCompleted = false;
  isRejected = false;
  isViewReq = false;
  reqId: any;
  showAdmin: number = 0;
  _yourReq: any;
  branch = sessionStorage.getItem('branchId');

  ngOnInit() {
    this.fetchRequestList();
  }
  constructor(private ReqService: RequestService) {}
  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.ReqService.adminRequestList(status, this.branch).subscribe(
        (res) => {
          this._yourReq = res;
          console.log(res);
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
      this.ReqService.adminRequestList(status, this.branch).subscribe(
        (res) => {
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
      this.ReqService.adminRequestList(status, this.branch).subscribe(
        (res) => {
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
    this.showAdmin = 3;
  }

  closeView(data: any) {
    this.isViewReq = data;
  }
}
