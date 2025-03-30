import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { debounceTime, Subject } from 'rxjs';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';
import { AuthService } from '../../service/Auth/auth.service';

@Component({
  selector: 'app-your-request',
  templateUrl: './your-request.component.html',
  styleUrl: './your-request.component.css',
})
export class YourRequestComponent implements OnInit {
  _yourReq: any;
  RequestID: any;
  indentNumber: string = '';
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
  isAuthorizeEditIndentForm: boolean = false;
  isAcceptedView: boolean = false;
  selectedRequestId: number | undefined | null = null;
  isViewEditIndentForm: boolean = false;


  toastService = inject(ToastService);
  authService = inject(AuthService);

  constructor(private readonly reqService: RequestService, private elRef: ElementRef) {
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
            
            this.isAuthorizeEditIndentForm = false;
            this.viewRequest(this.requestList?.sno);

            const userRoles = this.authService.getUserRoles();
            if (userRoles.includes('ROLE_INDENT_DETAILS_EDITOR')) {
              this.isAuthorizeEditIndentForm = true;
            } else {
              this.isAuthorizeEditIndentForm = false;
            }

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

    const userRoles = this.authService.getUserRoles();
    if (userRoles.includes('ROLE_INDENT_DETAILS_EDITOR')) {
      this.isAuthorizeEditIndentForm = true;
    } else {
      this.isAuthorizeEditIndentForm = false;
    }

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

    if(this.isAuthorizeEditIndentForm){
      this.isAcceptedView = true;
      this.selectedRequestId = data;
    }else{
      this.isAcceptedView = false;
      this.selectedRequestId = null;
      this.isViewReq = true;
    }
  }


  openViewRequest(sno: number) {
    this.RequestID = sno;

    this.isViewReq = true;
  }

  editIndentForm(sno: number, indentNum: string) {
    this.RequestID = sno;
    this.indentNumber = indentNum;

    if(this.isAuthorizeEditIndentForm = true){
      this.isViewEditIndentForm = true;
    }
    
  }
}
