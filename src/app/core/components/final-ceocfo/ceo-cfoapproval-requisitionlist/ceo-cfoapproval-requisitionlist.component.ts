import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { Request as AppRequest } from '../../../models/request/request.model';
import { ToastService } from '../../service/toast/toast.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ceo-cfoapproval-requisitionlist',
  templateUrl: './ceo-cfoapproval-requisitionlist.component.html',
  styleUrl: './ceo-cfoapproval-requisitionlist.component.css',
})
export class CeoCfoapprovalRequisitionlistComponent {
  maxDate: Date | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  isViewSelectedDate: boolean = true;
  userId: string | null = '';
  specialRoleId: number = 0;
  selectedRequests: Set<number> = new Set();
  isApproved: boolean = false;
  signUploaded!: boolean;
  isViewConsolidatedQuote: boolean = false;
  showSearchResult: boolean = false;

  isProcess = true;
  isCompleted = false;
  isView = false;
  isAcceptedView: boolean = false;
  isViewQuoteCompare: boolean = false;
  selectedRequestId: number | null | undefined = null;
  noRequest: boolean = false;
  isSkeletonLoader: boolean = true;
  isEndDateManuallySelected: boolean = false;

  reqId: any;
  indentNumber: string | undefined = '';

  requestList: AppRequest | undefined;

  private closeDropdownTimeout: ReturnType<typeof setTimeout> | null = null;

  empService = inject(EmployeeServiceService);
  toastService = inject(ToastService);

  specialRolesProcessList: AppRequest[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private req: RequestService,
    private elRef: ElementRef,
  ) {
    const today = new Date();
    this.maxDate = new Date();
  }

  ngOnInit() {
    console.log('checking procurement list');
    this.req.getDebouncedSearchObservable().subscribe((indentCode) => {
      this.req.fetchRequestByIndentCode(indentCode).subscribe(
        (res: any) => {
          console.log('fetching indent request in user request:', res);
          this.requestList = res;
          this.viewRequest(
            event as Event,
            this.requestList?.sno,
            this.requestList?.requestNo,
          );
        },
        (error) => {
          console.log('error while fetching indent details:', error);

          if (error.error.status === 204) {
            this.toastService.showError(error.error.errorMessege);
          }
        },
      );
    });

    this.userId = sessionStorage.getItem('userId');

    this.empService.getEmployeeDetails(this.userId).subscribe(
      (res: any) => {
        console.log('fetching employee details:', res);
        this.specialRoleId = res.specialRoleId;
        this.signUploaded = res.signUploaded;
        console.log('this.specialRoleId:', this.specialRoleId);
        this.fetchRequestList();
      },
      (error) => {
        console.log('error while employee details:', error);
      },
    );

    this.range.valueChanges.subscribe((val) => {
      const { start, end } = val;
      if (start && end && this.isEndDateManuallySelected) {
        this.startDate = this.formatDateOnly(start);
        this.endDate = this.formatDateOnly(end);

        this.fetchRequestList();
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

  fetchRequestList() {
    if (this.isProcess == true && this.isCompleted == false) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.isSkeletonLoader = true;
      this.noRequest = false;
      console.log('this.specialRoleId in method:', this.specialRoleId);
      this.req
        .fetchSpecialRolesRequestIsProcessAndAccept(status, this.specialRoleId)
        .subscribe(
          (res: any) => {
            this.specialRolesProcessList = res;
            console.log('fetching special roles request processing list:', res);
            this.noRequest = false;
            this.isSkeletonLoader = false;
          },
          (error) => {
            console.log(
              'error while fetching processing special roles request:',
              error,
            );
            this.isSkeletonLoader = false;
            if (error.status == 204) {
              this.specialRolesProcessList = [];
            } else if (error.status === 404) {
              this.specialRolesProcessList = [];
              this.noRequest = true;
            }
          },
        );
    }
    if (this.isProcess == false && this.isCompleted == true) {
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.req
        .fetchSpecialRolesRequestIsProcessAndAccept(
          202,
          this.specialRoleId,
          this.startDate,
          this.endDate
        )
        .subscribe(
          (res: any) => {
            console.log('fetching completed special roles request:', res);
            this.specialRolesProcessList = res;

            this.noRequest = false;
            this.isSkeletonLoader = false;
            this.isEndDateManuallySelected = false;
          },
          (error) => {
            console.log(
              'error while fetching completed special roles request:',
              error,
            );

            this.isSkeletonLoader = false;
            this.isEndDateManuallySelected = false;
            if (error.status == 204) {
              this.specialRolesProcessList = [];
            } else if (error.status === 404) {
              this.specialRolesProcessList = [];
              this.noRequest = true;
            }
          },
        );
    }
  }

  handleFocus(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue.trim() === '') {
      this.showSearchResult = true;
    }
  }

  handleInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    this.showSearchResult = inputValue.trim() === '';
  }

  fetchReqByIndentCode(event: Event) {
    const enteredIndentCode = (event.target as HTMLInputElement).value;

    if (!enteredIndentCode) {
      return;
    }

    this.req.triggerSearch(enteredIndentCode);
  }

  isAnyCheckboxSelected(): boolean {
    return this.selectedRequests.size > 0;
  }

  isAllSelected(): boolean {
    return this.selectedRequests.size === this.specialRolesProcessList.length;
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedRequests.clear();
    } else {
      this.selectedRequests = new Set(
        this.specialRolesProcessList.map((req) => req.sno),
      );
    }

    console.log('selectedRequests:', this.selectedRequests);
  }

  toggleSelection(reqId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    console.log('checked:', checked);

    if (checked) {
      this.selectedRequests.add(reqId);
    } else {
      this.selectedRequests.delete(reqId);
    }

    console.log('selectedRequests:', this.selectedRequests);
  }

  acceptSelectedRequestSpecialRole() {
    const requestPayload = Array.from(this.selectedRequests).map((sno) => ({
      sno,
    }));

    console.log('requestPayload:', requestPayload);

    this.req
      .acceptSpecialRoleRequest(this.specialRoleId, requestPayload)
      .subscribe(
        (res) => {
          console.log(
            'successfully special role accepted selected request:',
            res,
          );
          this.isApproved = true;
        },
        (error) => {
          console.log(
            'error while accepting selected request in special role:',
            error,
          );
        },
      );
  }

  viewRequest(
    event: Event,
    data: number | undefined,
    indentNO: string | undefined,
  ) {
    event.stopPropagation();
    console.log(data);
    this.reqId = data;
    this.indentNumber = indentNO;
    if (this.isProcess == true) {
      this.isView = true;
      this.isAcceptedView = false;
    } else if (this.isCompleted == true) {
      if (this.closeDropdownTimeout) {
        clearTimeout(this.closeDropdownTimeout);
        this.closeDropdownTimeout = null;
      }

      if (this.selectedRequestId === data) {
        this.selectedRequestId = null;
        this.isAcceptedView = false;
      } else {
        this.selectedRequestId = data;
        this.isAcceptedView = true;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.selectedRequestId) return;
    if (
      !(event.target as HTMLElement).closest('.dropdown-container') &&
      !(event.target as HTMLElement).closest('.dropdown-button')
    ) {
      this.selectedRequestId = null;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.selectedRequestId) return;
    const dropdown = this.elRef.nativeElement.querySelector(
      '.dropdown-container',
    );

    if (dropdown && !dropdown.contains(event.target as Node)) {
      if (!this.closeDropdownTimeout) {
        this.closeDropdownTimeout = setTimeout(() => {
          this.selectedRequestId = null;
          this.closeDropdownTimeout = null;
        }, 300);
      }
    } else {
      if (this.closeDropdownTimeout) {
        clearTimeout(this.closeDropdownTimeout);
        this.closeDropdownTimeout = null;
      }
    }
  }

  openQuoteComparison(sno: number, indentNO: string) {
    console.log(sno);
    this.reqId = sno;
    this.indentNumber = indentNO;
    if (this.isCompleted === true) {
      this.isView = true;
    }
  }

  openConsolidatedQuote(sno: number) {
    this.reqId = sno;

    if (this.isCompleted === true) {
      this.isViewConsolidatedQuote = true;
    }
  }

  refresh(data: any) {
    this.isView = data;
    this.isViewQuoteCompare = data;
    this.isViewConsolidatedQuote = data;
    this.fetchRequestList();
  }

  closepop(closeIcon: boolean) {
    this.isApproved = closeIcon;
  }
}
