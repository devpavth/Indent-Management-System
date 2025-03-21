import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';

@Component({
  selector: 'app-requisition-list',
  templateUrl: './requisition-list.component.html',
  styleUrl: './requisition-list.component.css',
})
export class RequisitionListComponent implements OnInit {
  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;
  noRequest: boolean = false;
  showSearchInfo: boolean = false;
  isSkeletonLoader: boolean = true;

  requestList: Request | undefined;

  toastService = inject(ToastService);

  ngOnInit() {
    this.req.getDebouncedSearchObservable().subscribe((indentCode) => {
      this.req.fetchRequestByIndentCode(indentCode).subscribe(
        (res: any) => {
          console.log('fetching indent request in user request:', res);
          this.requestList = res;
          this.viewRequest(this.requestList?.sno);
        },
        (error) => {
          console.log('error while fetching indent details:', error);

          if (error.error.status === 204) {
            this.toastService.showError(error.error.errorMessege);
          }
        },
      );
    });

    this.fetchRequestList();
  }

  constructor(private req: RequestService) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }
  isProcess = true;
  isCompleted = false;
  isHold = false;
  isRejected = false;
  isView = false;
  userRequest: any;

  reqId: any;

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isHold == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.req.finRequestList(status).subscribe(
        (res) => {
          this.userRequest = res;
          console.log('fetching finance request processing list:', res);
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching processing finance request:',
            error,
          );

          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
            this.noRequest = true;
          }
        },
      );
    }
    if (
      this.isProcess == false &&
      this.isCompleted == true &&
      this.isHold == false &&
      this.isRejected == false
    ) {
      this.isViewSelectedDate = true;
      this.req.finRequestList(202, this.currentDate).subscribe(
        (res: any) => {
          console.log('fetching completed finance request:', res);
          // let list: any[] = res;
          // console.log("listing completed:", list);
          // list = list.filter((l) => l.requestStatus == 102);
          // console.log("filtering completed request:", list);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching completed finance request:', error);
          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
            this.noRequest = true;
          }
        },
      );
    }
    if (
      this.isProcess == false &&
      this.isCompleted == false &&
      this.isHold == true &&
      this.isRejected == false
    ) {
      this.isViewSelectedDate = false;
      this.req.finRequestList(418).subscribe(
        (res: any) => {
          console.log('fetching finance request on hold list:', res);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching on hold finance request:', error);
          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
            this.noRequest = true;
          }
        },
      );
    }
    if (
      this.isProcess == false &&
      this.isCompleted == false &&
      this.isHold == false &&
      this.isRejected == true
    ) {
      this.isViewSelectedDate = true;
      this.req.finRequestList(406, this.currentDate).subscribe(
        (res: any) => {
          console.log('fetching finance request rejected list:', res);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching rejected finance request:', error);
          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
            this.noRequest = true;
          }
        },
      );
    }
  }

  handleFocus(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue.trim() === '') {
      this.showSearchInfo = true;
    }
  }

  handleInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    this.showSearchInfo = inputValue.trim() === '';
  }

  fetchReqByIndentCode(event: Event) {
    const enteredIndentCode = (event.target as HTMLInputElement).value;

    if (!enteredIndentCode) {
      return;
    }

    this.req.triggerSearch(enteredIndentCode);
  }

  viewRequest(data: any) {
    console.log(data);
    this.reqId = data;
    this.isView = true;
  }
  refresh(data: any) {
    this.isView = data;
    this.fetchRequestList();
  }
}
