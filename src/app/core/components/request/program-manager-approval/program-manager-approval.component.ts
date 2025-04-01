import { Component, inject } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { debounceTime, Subject } from 'rxjs';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';
import { AuthService } from '../../service/Auth/auth.service';

@Component({
  selector: 'app-program-manager-approval',
  templateUrl: './program-manager-approval.component.html',
  styleUrl: './program-manager-approval.component.css',
})
export class ProgramManagerApprovalComponent {
  isProcess = true;
  isCompleted = false;
  isRejected = false;
  isViewReq = false;
  branch = sessionStorage.getItem('branchCode');

  reqId: any;
  showManager: number = 0;
  _yourReq: any;

  selectedDate: string | undefined;
  maxDate: string | undefined;

  isViewSelectedDate: boolean = true;
  noRequest: boolean = false;
  showSearchInfo: boolean = false;
  isSkeletonLoader: boolean = true;
  isAuthorizeEditIndentForm: boolean = false;
  isAcceptedView: boolean = false;
  isViewEditIndentForm: boolean = false;

  requestList: Request | undefined;

  selectedRequestId: number | undefined | null = null;

  searchSubject = new Subject<string>();

  toastService = inject(ToastService);
  authService = inject(AuthService);

  constructor(private rService: RequestService) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.rService.getDebouncedSearchObservable().subscribe((indentCode) => {
      this.rService.fetchRequestByIndentCode(indentCode).subscribe(
        (res: any) => {
          console.log('fetching indent request in user request:', res);
          this.requestList = res;

          if (this.branch === this.requestList?.branchCode) {
            this.isAuthorizeEditIndentForm = false;
            this.viewRequest(this.requestList.sno);

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

    this.fetchRequestList();
  }

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      this.isViewSelectedDate = false;
      this.rService.fetchProgramManagerRequest(102).subscribe(
        (res: any) => {
          console.log('fetching processing request:', res);
          let list: any[] = res;
          console.log('list:', list);
          list = list.filter((l) => l.requestStatus == 201);
          console.log('filtering processing request:', list);

          this._yourReq = list;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching processing request:', error);
          this.isSkeletonLoader = false;
          if (error.status == 204) {
            this._yourReq = undefined;
            // this.noRequest = true;
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
      this.isViewSelectedDate = true;
      this.rService
        .fetchProgramManagerRequest(202, this.selectedDate)
        .subscribe(
          (res: any) => {
            console.log('fetching completed request:', res);
            // let list: any[] = res;
            // console.log("listing completed:", list);
            // list = list.filter((l) => l.requestStatus == 102);
            // console.log("filtering completed request:", list);
            this._yourReq = res;
            this.noRequest = false;
            this.isSkeletonLoader = false;
          },
          (error) => {
            console.log('error while fetching completed request:', error);
            this.isSkeletonLoader = false;
            if (error.status == 204) {
              this._yourReq = undefined;
              // this.noRequest = true;
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
      this.isViewSelectedDate = true;
      this.rService
        .fetchProgramManagerRequest(406, this.selectedDate)
        .subscribe(
          (res: any) => {
            console.log('fetching rejected request:', res);
            let list: any[] = res;
            list = list.filter((l) => l.requestStatus == 406);
            console.log('filtering rejected request:', list);
            this._yourReq = list;
            this.noRequest = false;
            this.isSkeletonLoader = false;
          },
          (error) => {
            console.log('error while fetching rejected request:', error);
            this.isSkeletonLoader = false;
            if (error.status == 204) {
              this._yourReq = undefined;
              // this.noRequest = true;
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
    console.log('viewing the request data:', data);
    this.reqId = data;
    this.showManager = 1;

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

  editIndentForm(sno: Number) {
    this.reqId = sno;

    if (this.isAuthorizeEditIndentForm) {
      this.isViewEditIndentForm = true;
    }
  }

  closeView(data: boolean) {
    this.isViewReq = data;
    this.isViewEditIndentForm = data;
    this.fetchRequestList();
  }
}
