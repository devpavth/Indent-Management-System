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

  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;

  ngOnInit() {
    this.fetchRequestList();
  }
  constructor(private ReqService: RequestService) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }
  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.ReqService.adminRequestList(status).subscribe(
        (res) => {
          this._yourReq = res;
          console.log("fetching admin request processing list:", res);
        },
        (error) => {
          console.log("error while fetching admin request processing list:", error);
          if (error.status == 204) {
            this._yourReq = undefined;
          }else if(error.status === 404){
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
      this.isViewSelectedDate = true;
      this.ReqService.adminRequestList(status, this.currentDate).subscribe(
        (res) => {
          this._yourReq = res;
          console.log("fetching admin request accepted list:", res);
        },
        (error) => {
          console.log("error while fetching admin request accepted list:", error);
          if (error.status == 204) {
            this._yourReq = undefined;
          }else if(error.status === 404){
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
      this.isViewSelectedDate = true;
      this.ReqService.adminRequestList(status, this.currentDate).subscribe(
        (res) => {
          this._yourReq = res;
          console.log("fetching admin request rejected list:", res);
        },
        (error) => {
          console.log("error while fetching admin request rejected list:", error);
          if (error.status == 204) {
            this._yourReq = undefined;
          }else if(error.status === 404){
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
    this.fetchRequestList();
  }
}
