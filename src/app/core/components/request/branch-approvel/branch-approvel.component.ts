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
  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;
  
  constructor(private rService: RequestService) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }
  ngOnInit() {
    this.fetchRequestList();
  }

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      this.isViewSelectedDate = false;
      this.rService.branchRequestList(102).subscribe(
        (res: any) => {
          console.log('fetching branch request processing list:', res);
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 102);
          console.log('fetching branch request processing list:', list);

          this._yourReq = list;
        },
        (error) => {
          console.log("error while fetching branch request processing list:", error);
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
      this.isViewSelectedDate = true;
      this.rService.branchRequestList(202, this.currentDate).subscribe(
        (res: any) => {
          console.log('fetching branch request accepted list:', res);
          // let list: any[] = res;
          // list = list.filter((l) => l.requestStatus == 102);
          // console.log('fetching branch request accepted list:', list);
          this._yourReq = res;
        },
        (error) => {
          console.log("error while fetching branch request accepted list:", error);
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
      this.isViewSelectedDate = true;
      this.rService.branchRequestList(406, this.currentDate).subscribe(
        (res: any) => {
          console.log('fetching branch request rejected list:', res);
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 406);
          console.log('fetching branch request rejected list:', list);
          this._yourReq = list;
        },
        (error) => {
          console.log("error while fetching branch request rejected list:", error);
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
    this.showBranch = 2;
  }
  closeView(data: boolean) {
    this.isViewReq = data;
    this.fetchRequestList();
  }
}
