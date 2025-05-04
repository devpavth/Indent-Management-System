import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';
import { AuthService } from '../../service/Auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  branch = sessionStorage.getItem('branchCode');

  maxDate: Date | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  isViewSelectedDate: boolean = true;
  noRequest: boolean = false;
  showSearchInfo: boolean = false;
  isSkeletonLoader: boolean = true;
  isAuthorizeEditIndentForm: boolean = false;
  isAcceptedView: boolean = false;
  isViewEditIndentForm: boolean = false;
  isEndDateManuallySelected: boolean = false;

  requestList: Request | undefined;

  selectedRequestId: number | null = null;

  searchText: string = '';

  toastService = inject(ToastService);
  authService = inject(AuthService);

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit() {
    this.ReqService.getDebouncedSearchObservable().subscribe((indentCode) => {
      this.ReqService.fetchRequestByIndentCode(indentCode).subscribe(
        (res: any) => {
          console.log('fetching indent request in user request:', res);
          this.requestList = res;

          this.isAuthorizeEditIndentForm = false;
          this._yourReq = res;
          this.noRequest = false;

          this.isAuthorizeEditIndentForm =
            this.authService.isAuthenticateEditIndentRole();
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

    this.range.valueChanges.subscribe((val) => {
      const { start, end } = val;
      if (start && end && this.isEndDateManuallySelected) {
        this.startDate = this.formatDateOnly(start);
        this.endDate = this.formatDateOnly(end);

        this.fetchRequestList();
        this.isEndDateManuallySelected = false;
      }
    });

    this.fetchRequestList();
  }
  constructor(private ReqService: RequestService) {
    const today = new Date();
    this.maxDate = new Date();
  }

  clearSearch(){
    this.searchText = '';
    this.fetchRequestList();
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

  onEndDateSelected(event: any) {
    this.isEndDateManuallySelected = true;
  }

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.ReqService.adminRequestList(status).subscribe(
        (res) => {
          this._yourReq = res;
          console.log('fetching admin request processing list:', res);
          this.noRequest = false;

          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching admin request processing list:',
            error,
          );

          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this._yourReq = undefined;
          } else if (error.status === 404) {
            this._yourReq = undefined;
            this.noRequest = true;
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
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.ReqService.adminRequestList(
        status,
        this.startDate,
        this.endDate,
      ).subscribe(
        (res) => {
          this._yourReq = res;
          console.log('fetching admin request accepted list:', res);
          this.noRequest = false;
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
        },
        (error) => {
          console.log(
            'error while fetching admin request accepted list:',
            error,
          );
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
          if (error.status == 204) {
            this._yourReq = undefined;
          } else if (error.status === 404) {
            this._yourReq = undefined;
            this.noRequest = true;
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
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.ReqService.adminRequestList(
        status,
        this.startDate,
        this.endDate,
      ).subscribe(
        (res) => {
          this._yourReq = res;
          console.log('fetching admin request rejected list:', res);
          this.noRequest = false;
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
        },
        (error) => {
          console.log(
            'error while fetching admin request rejected list:',
            error,
          );

          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
          if (error.status == 204) {
            this._yourReq = undefined;
          } else if (error.status === 404) {
            this._yourReq = undefined;
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

    if(inputValue === ''){
      this.fetchRequestList();
    }

    this.showSearchInfo = inputValue.trim() === '';
  }

  fetchReqByIndentCode(event: Event) {
    const enteredIndentCode = (event.target as HTMLInputElement).value;

    if (!enteredIndentCode) {
      return;
    }

    this.ReqService.triggerSearch(enteredIndentCode);
  }

  viewRequest(data: any) {
    console.log(data);
    this.reqId = data;
    this.showAdmin = 3;

    if (this.isAuthorizeEditIndentForm && this.isProcess) {
      this.isAcceptedView = true;
      this.selectedRequestId = data;
    } else {
      this.isAcceptedView = false;
      this.selectedRequestId = null;
      this.isViewReq = true;
    }
  }

  openViewRequest(sno: number) {
    this.reqId = sno;
    this.isViewReq = true;
  }

  editIdentForm(sno: number) {
    this.reqId = sno;

    if (this.isAuthorizeEditIndentForm) {
      this.isViewEditIndentForm = true;
    }
  }

  closeView(data: any) {
    this.isViewReq = data;
    this.isViewEditIndentForm = data;
  }
}
