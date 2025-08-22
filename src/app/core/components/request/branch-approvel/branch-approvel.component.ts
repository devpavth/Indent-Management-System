import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { Request } from '../../../models/request/request.model';
import { ToastService } from '../../service/toast/toast.service';
import { AuthService } from '../../service/Auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  branch = sessionStorage.getItem('branchCode');

  reqId: any;
  showBranch: number = 0;
  _yourReq: any;

  currentDate: string | undefined;
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

  searchText: string = '';

  requestList: Request[] = [];

  selectedRequestId: number | undefined | null = null;

  toastService = inject(ToastService);
  authService = inject(AuthService);

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private rService: RequestService) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.maxDate = new Date();
  }
  ngOnInit() {
    this.rService.getDebouncedSearchObservable().subscribe((indentCode) => {
      this.rService.fetchRequestByIndentCode(indentCode).subscribe(
        (res: any) => {
          console.log('fetching indent request in user request:', res);
          this.requestList = res;

          if (this.branch === this.requestList[0].branchCode) {
            this.isAuthorizeEditIndentForm = false;
            this._yourReq = res;
            this.noRequest = false;

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

  clearSearch() {
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
      this.isViewSelectedDate = false;
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.rService.branchRequestList(102).subscribe(
        (res: any) => {
          console.log('fetching branch request processing list:', res);
          let list: any[] = res;
          list = list.filter((l) => l.requestStatus == 102);
          console.log('fetching branch request processing list:', list);

          this._yourReq = list;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching branch request processing list:',
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
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.rService
        .branchRequestList(202, this.startDate, this.endDate)
        .subscribe(
          (res: any) => {
            console.log('fetching branch request accepted list:', res);
            this._yourReq = res;
            this.noRequest = false;
            this.isSkeletonLoader = false;
            this.isEndDateManuallySelected = false;
          },
          (error) => {
            console.log(
              'error while fetching branch request accepted list:',
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
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.rService
        .branchRequestList(406, this.startDate, this.endDate)
        .subscribe(
          (res: any) => {
            console.log('fetching branch request rejected list:', res);
            let list: any[] = res;
            list = list.filter((l) => l.requestStatus == 406);
            console.log('fetching branch request rejected list:', list);
            this._yourReq = list;
            this.noRequest = false;
            this.isSkeletonLoader = false;
            this.isEndDateManuallySelected = false;
          },
          (error) => {
            console.log(
              'error while fetching branch request rejected list:',
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

    if (inputValue === '') {
      this.fetchRequestList();
    }

    this.showSearchInfo = inputValue.trim() === '';
  }

  fetchReqByIndentCode(event: Event) {
    const enteredIndentCode = (event.target as HTMLInputElement).value;

    if (!enteredIndentCode) {
      return;
    }

    this.rService.triggerSearch(enteredIndentCode);
  }

  viewRequest(data: number) {
    console.log(data);
    this.reqId = data;
    this.showBranch = 2;

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

  editIndentForm(sno: number) {
    this.reqId = sno;

    if (this.isAuthorizeEditIndentForm) {
      this.isViewEditIndentForm = true;
    }
  }

  closeView(data: boolean) {
    this.isViewReq = data;
    this.isViewEditIndentForm = data;
  }
}
