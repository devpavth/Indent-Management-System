import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { debounceTime, Subject } from 'rxjs';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';

@Component({
  selector: 'app-your-request',
  templateUrl: './your-request.component.html',
  styleUrl: './your-request.component.css',
})
export class YourRequestComponent implements OnInit {
  _yourReq: any;
  RequestID: any;
  isCreated: boolean = true;
  isProcess: boolean = false;
  isCompleted: boolean = false;
  isRejected: boolean = false;

  isViewReq: boolean = false;

  selectedDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;

  noRequest: boolean = false;
  requestList: Request | undefined;

  showSearchInfo: boolean = false;
  isSkeletonLoader: boolean = true;

  toastService = inject(ToastService);

  constructor(private readonly reqService: RequestService) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.reqService.getDebouncedSearchObservable().subscribe((indentCode) => {
      this.reqService.fetchRequestByIndentCode(indentCode).subscribe(
        (res: any) => {
          console.log('fetching indent request in user request:', res);
          this.requestList = res;

          const branchCode = sessionStorage.getItem('branchCode');
          console.log('branchCode validation:', branchCode);

          if (branchCode === this.requestList?.branchCode) {
            // this.showSearchInfo = false;
            this.viewRequest(this.requestList?.sno);
          } else {
            this.toastService.showError("You can't view other branch indent");
          }
        },
        (error) => {
          console.log('error while fetching indent details:', error);

          if (error.error.status === 204) {
            this.toastService.showError(error.error.errorMessege);
          }
        },
      );
    });

    this.fetchYourRequest();
  }
  // 102 p,200 c,406 rej
  fetchYourRequest() {
    if (
      (this.isCreated == true,
      this.isProcess == false &&
        this.isCompleted == false &&
        this.isRejected == false)
    ) {
      let status = 201;
      this.reqService.getUserReq(this.selectedDate).subscribe(
        (res) => {
          this._yourReq = res;
          console.log('fetching user request list:', res);

          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching user request list:', error);
          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this._yourReq = undefined;
          }
          if (error.status === 404) {
            this._yourReq = undefined;
            this.noRequest = true;
            this.isSkeletonLoader = false;
          }
        },
      );
    }

    // if (
    //   (this.isCreated == false,
    //   this.isProcess == true &&
    //     this.isCompleted == false &&
    //     this.isRejected == false)
    // ) {
    //   let status = 102;
    //   this.reqService.getYourReq(status).subscribe(
    //     (res) => {
    //       this._yourReq = res;
    //       console.log(res);
    //     },
    //     (error) => {
    //       if (error.status == 204) {
    //         this._yourReq = undefined;
    //       }
    //     },
    //   );
    // }
    // if (
    //   (this.isCreated == false,
    //   this.isProcess == false &&
    //     this.isCompleted == true &&
    //     this.isRejected == false)
    // ) {
    //   let status = 200;
    //   this.reqService.getYourReq(status).subscribe(
    //     (res) => {
    //       this._yourReq = res;
    //       console.log(res);
    //     },
    //     (error) => {
    //       if (error.status == 204) {
    //         this._yourReq = undefined;
    //       }
    //     },
    //   );
    // }
    // if (
    //   (this.isCreated == false,
    //   this.isProcess == false &&
    //     this.isCompleted == false &&
    //     this.isRejected == true)
    // ) {
    //   let status = 406;
    //   this.reqService.getYourReq(status).subscribe(
    //     (res) => {
    //       this._yourReq = res;
    //       console.log(res);
    //     },
    //     (error) => {
    //       if (error.status == 204) {
    //         this._yourReq = undefined;
    //       }
    //     },
    //   );
    // }
  }

  fetchReqByIndentCode(event: Event) {
    const enteredIndentCode = (event.target as HTMLInputElement).value.trim();

    if (!enteredIndentCode) {
      return;
    }
    this.reqService.triggerSearch(enteredIndentCode);
  }

  handleFocus(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue.trim() === '') {
      this.showSearchInfo = true;
    }
  }

  handleInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    // console.log('inputValue check:', inputValue);

    this.showSearchInfo = inputValue.trim() === '';
  }

  closeView(data: any) {
    this.isViewReq = data;
  }

  viewRequest(data: any) {
    this.RequestID = data;
    console.log(data);

    this.isViewReq = true;
  }
}
