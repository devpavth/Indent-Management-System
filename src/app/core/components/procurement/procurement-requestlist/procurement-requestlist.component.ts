import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { Request } from '../../../models/request/request.model';
import { ToastService } from '../../service/toast/toast.service';

@Component({
  selector: 'app-procurement-requestlist',
  templateUrl: './procurement-requestlist.component.html',
  styleUrl: './procurement-requestlist.component.css',
})
export class ProcurementRequestlistComponent {
  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;
  noRequest: boolean = false;
  showSearchInfo: boolean = false;

  requestList: Request | undefined;

  dropdownPosition = { top: 0, right: 0 };

  toastService = inject(ToastService);

  private closeDropdownTimeout: ReturnType<typeof setTimeout> | null = null;

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

    this.fetchRequestList();
  }

  constructor(
    private req: RequestService,
    private elRef: ElementRef,
  ) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }
  isProcess = true;
  isCompleted = false;
  isHold = false;
  isRejected = false;
  isView = false;
  isAcceptedView: boolean = false;
  isViewQuoteCompare: boolean = false;
  isViewConsolidatedQuote: boolean = false;
  userRequest: any;
  selectedRequestId: number | undefined;
  tooltipSno: number | null = null;
  isSkeletonLoader: boolean = true;

  reqId: any;
  indentNumber: string | undefined = '';

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isHold == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.req.fetchPrctReqList(status).subscribe(
        (res) => {
          this.userRequest = res;
          console.log('fetching procurement request processing list:', res);
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching processing procurement request:',
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
      this.req.fetchPrctReqList(202, this.currentDate).subscribe(
        (res: any) => {
          console.log('fetching completed procurement request:', res);
          // let list: any[] = res;
          // console.log("listing completed:", list);
          // list = list.filter((l) => l.requestStatus == 102);
          // console.log("filtering completed request:", list);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching completed procurement request:',
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
        this.selectedRequestId = undefined;
        this.isAcceptedView = false;

        const buttonElement = (event.currentTarget as HTMLElement).closest(
          'button',
        );
        if (!buttonElement) return;

        const tableRow = buttonElement.closest('tr');
        if (!tableRow) return;

        const buttonRect = buttonElement.getBoundingClientRect();
        const tableRect = tableRow.getBoundingClientRect();

        this.dropdownPosition = {
          top: buttonRect.top + window.scrollY,
          right: buttonRect.right + window.scrollX,
        };
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
      this.selectedRequestId = undefined;
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
          this.selectedRequestId = undefined;
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
      this.isViewQuoteCompare = true;
    }
  }

  openConsolidatedQuote(sno: number) {
    console.log('sno in openConsolidatedQuote:', sno);
    this.reqId = sno;

    if (this.isCompleted === true) {
      this.isViewConsolidatedQuote = true;
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

  refresh(data: any) {
    this.isView = data;
    // this.isAcceptedView = data;
    this.isViewQuoteCompare = data;
    this.isViewConsolidatedQuote = data;
    this.fetchRequestList();
  }
}
