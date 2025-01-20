import { Component } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css',
})
export class VerificationComponent {
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
      this.rService.branchRequestList(102).subscribe(
        (res: any) => {
          console.log('verification', res);
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 201);
          console.log(list);

          this._yourReq = list;
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
      this.rService.branchRequestList(202).subscribe(
        (res: any) => {
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 102);
          console.log(list);
          this._yourReq = list;
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
      this.rService.branchRequestList(406).subscribe(
        (res: any) => {
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 406);
          console.log(list);
          this._yourReq = list;
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
