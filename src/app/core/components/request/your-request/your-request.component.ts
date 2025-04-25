import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { debounceTime, Subject } from 'rxjs';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';
import { AuthService } from '../../service/Auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  isOnHold: boolean = false;
  isCompleted: boolean = false;
  isRejected: boolean = false;
  isViewReq: boolean = false;
  isEndDateManuallySelected: boolean = false;

  startDate: string | undefined;
  endDate: string | undefined;
  maxDate: Date | undefined;
  isViewSelectedDate: boolean = true;

  noRequest: boolean = false;
  requestList: Request | undefined;

  showSearchInfo: boolean = false;
  isSkeletonLoader: boolean = true;
  isViewNewRequestBtn: boolean = false;
  isAuthorizeEditIndentForm: boolean = false;
  isAcceptedView: boolean = false;
  selectedRequestId: number | undefined | null = null;
  isViewEditIndentForm: boolean = false;

  toastService = inject(ToastService);
  authService = inject(AuthService);

  constructor(
    private readonly reqService: RequestService,
    private elRef: ElementRef,
  ) {
    const today = new Date();
    this.maxDate = new Date();
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

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

            this.isAuthorizeEditIndentForm = false;
            this.viewRequest(this.requestList?.sno);

            this.isAuthorizeEditIndentForm =
              this.authService.isAuthenticateEditIndentRole();
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

    this.isAuthorizeEditIndentForm =
      this.authService.isAuthenticateEditIndentRole();

    this.fetchYourRequest();

    this.range.valueChanges.subscribe((val) => {
      const { start, end } = val;
      if (start && end && this.isEndDateManuallySelected) {
        this.startDate = this.formatDateOnly(start);
        this.endDate = this.formatDateOnly(end);
        console.log(this.startDate, this.endDate);
        this.fetchYourRequest();

        this.isEndDateManuallySelected = false;
      }
    });
  }

  formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  setTodayDateRange() {
    const today = new Date();
    this.isEndDateManuallySelected = true;
    this.range.setValue({
      start: today,
      end: today,
    });
  }

  onEndDateSelected(event: any){
    this.isEndDateManuallySelected = true;
  }

  // 102 p,200 c,406 rej
  fetchYourRequest() {
    if (
      this.isCreated &&
      !this.isProcess &&
      !this.isOnHold &&
      !this.isCompleted &&
      !this.isRejected
    ) {
      let status = 201;
      this.isViewSelectedDate = false;
      this.reqService.getUserReq(status).subscribe(
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
            this.isViewNewRequestBtn = true;
          }
        },
      );
    }
    if (
      !this.isCreated &&
      this.isProcess &&
      !this.isOnHold &&
      !this.isCompleted &&
      !this.isRejected
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.reqService.getUserReq(status).subscribe(
        (res) => {
          console.log('fetching processing user request list:', res);
          this._yourReq = res;

          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching processing user request list:',
            error,
          );
          this.isSkeletonLoader = false;

          if (error.status === 404) {
            this._yourReq = undefined;
            this.noRequest = true;
            this.isSkeletonLoader = false;
            this.isViewNewRequestBtn = false;
          }
        },
      );
    }
    if (
      !this.isCreated &&
      !this.isProcess &&
      this.isOnHold &&
      !this.isCompleted &&
      !this.isRejected
    ) {
      let status = 418;
      this.isViewSelectedDate = false;
      this.reqService.getUserReq(status).subscribe(
        (res) => {
          console.log('fetching onhold user request list:', res);
          this._yourReq = res;

          this.isSkeletonLoader = false;
          this.noRequest = false;
        },
        (error) => {
          console.log('error while fetching onhold user request list:', error);

          if (error.status === 404) {
            this._yourReq = undefined;
            this.noRequest = true;
            this.isSkeletonLoader = false;
            this.isViewNewRequestBtn = false;
          }
        },
      );
    }
    if (
      !this.isCreated &&
      !this.isProcess &&
      !this.isOnHold &&
      this.isCompleted &&
      !this.isRejected
    ) {
      let status = 100;
      console.log('date range form:', this.range.value);
      this.reqService
        .getUserReq(status, this.startDate, this.endDate)
        .subscribe(
          (res) => {
            console.log('fetching accepted user request list:', res);
            this._yourReq = res;

            this.isSkeletonLoader = false;
            this.noRequest = false;
          },
          (error) => {
            console.log(
              'error while fetching accepted user request list:',
              error,
            );
            this.isSkeletonLoader = false;

            if (error.status === 404) {
              this._yourReq = undefined;
              this.noRequest = true;
              this.isSkeletonLoader = false;
              this.isViewNewRequestBtn = false;
            }
          },
        );
    }
    if (
      !this.isCreated &&
      !this.isProcess &&
      !this.isOnHold &&
      !this.isCompleted &&
      this.isRejected
    ) {
      let status = 406;
      this.reqService
        .getUserReq(status, this.startDate, this.endDate)
        .subscribe(
          (res) => {
            console.log('fetching rejected user request list:', res);
            this._yourReq = res;

            this.isSkeletonLoader = false;
            this.noRequest = false;
          },
          (error) => {
            console.log(
              'error while fetching rejected user request list:',
              error,
            );
            this.isSkeletonLoader = false;

            if (error.status === 404) {
              this._yourReq = undefined;
              this.noRequest = true;
              this.isSkeletonLoader = false;
              this.isViewNewRequestBtn = false;
            }
          },
        );
    }
  }

  fetchReqByIndentCode(event: Event) {
    const enteredIndentCode = (event.target as HTMLInputElement).value.trim();

    if (!enteredIndentCode) {
      return;
    }
    this.reqService.triggerSearch(enteredIndentCode);
  }

  handleFocus(event: Event) {
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
    this.isViewEditIndentForm = data;
  }

  viewRequest(data: any) {
    this.RequestID = data;
    console.log(data);

    if (this.isAuthorizeEditIndentForm && this.isCreated) {
      this.isAcceptedView = true;
      this.selectedRequestId = data;
    } else {
      this.isAcceptedView = false;
      this.selectedRequestId = null;
      this.isViewReq = true;
    }
  }

  openViewRequest(sno: number) {
    this.RequestID = sno;

    this.isViewReq = true;
  }

  editIndentForm(sno: number) {
    this.RequestID = sno;

    if ((this.isAuthorizeEditIndentForm = true)) {
      this.isViewEditIndentForm = true;
    }
  }
}
