import { Component } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-program-manager-approval',
  templateUrl: './program-manager-approval.component.html',
  styleUrl: './program-manager-approval.component.css'
})
export class ProgramManagerApprovalComponent {
  isProcess = true;
  isCompleted = false;
  isRejected = false;
  isViewReq = false;
  branch = sessionStorage.getItem('branchId');

  reqId: any;
  showManager: number = 0;
  _yourReq: any;

  selectedDate: string | undefined;
  
  constructor(private rService: RequestService) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
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
      this.rService.fetchProgramManagerRequest(102, this.selectedDate).subscribe(
        (res: any) => {
          console.log('fetching processing request:', res);
          let list: any[] = res;
          console.log("list:", list);
          list = list.filter((l) => l.requestStatus == 201);
          console.log("filtering processing request:",list);

          this._yourReq = list;
        },
        (error) => {
          console.log("error while fetching processing request:", error);
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
      this.rService.fetchProgramManagerRequest(202, this.selectedDate).subscribe(
        (res: any) => {
          console.log("fetching completed request:", res);
          let list: any[] = res;
          console.log("listing completed:", list);
          list = list.filter((l) => l.requestStatus == 102);
          console.log("filtering completed request:",list);
          this._yourReq = list;
        },
        (error) => {
          console.log("error while fetching completed request:", error);
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
      this.rService.fetchProgramManagerRequest(406, this.selectedDate).subscribe(
        (res: any) => {
          console.log("fetching rejected request:", res);
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 406);
          console.log("filtering rejected request:", list);
          this._yourReq = list;
        },
        (error) => {
          console.log("error while fetching rejected request:", error);
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
  }

  viewRequest(data: any) {
    this.isViewReq = true;
    console.log("viewing the request data:", data);
    this.reqId = data;
    this.showManager = 1;
  }
  closeView(data: boolean) {
    this.isViewReq = data;
    this.fetchRequestList();
  }
}
