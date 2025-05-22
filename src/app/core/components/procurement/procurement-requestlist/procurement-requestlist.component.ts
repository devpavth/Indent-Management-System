import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { Request } from '../../../models/request/request.model';
import { ToastService } from '../../service/toast/toast.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-procurement-requestlist',
  templateUrl: './procurement-requestlist.component.html',
  styleUrl: './procurement-requestlist.component.css',
})
export class ProcurementRequestlistComponent {
  maxDate: Date | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  isViewSelectedDate: boolean = true;
  noRequest: boolean = false;
  showSearchInfo: boolean = false;
  isEndDateManuallySelected: boolean = false;
  isPendingPO: boolean = false;
  isPendingPOView: boolean = false;
  isProcessAndAccepted: boolean = false;
  isViewModeOfPayment: boolean = false;

  dropdownPosition = { top: 0, right: 0 };

  toastService = inject(ToastService);

  private closeDropdownTimeout: ReturnType<typeof setTimeout> | null = null;

  isProcess = true;
  isCompleted = false;
  isView = false;
  isAcceptedView: boolean = false;
  isViewQuoteCompare: boolean = false;
  isViewConsolidatedQuote: boolean = false;
  userRequest: any;
  selectedRequestId: number | undefined;
  tooltipSno: number | null = null;
  isSkeletonLoader: boolean = true;

  selectedHeadOfAccId: number = 0;
  searchText: string = '';

  reqId: any;
  indentNumber: string | undefined = '';

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
          this.userRequest = res;
          this.noRequest = false;
        },
        (error) => {
          console.log('error while fetching indent details:', error);

          if (error.error.status === 204) {
            this.toastService.showError(error.error.errorMessege);
          }
        },
      );
    });

    this.range.valueChanges.subscribe((val) => {
      const { start, end } = val;
      console.log('Date range changed:', { start, end });
      if (start && end && this.isEndDateManuallySelected) {
        this.startDate = this.formatDateOnly(start);
        this.endDate = this.formatDateOnly(end);
        console.log('Triggering API with:', this.startDate, this.endDate);
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
    if (this.isProcess == true && this.isCompleted == false && !this.isPendingPO) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.isProcessAndAccepted = true;
      this.isPendingPOView = false;
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
    if (this.isProcess == false && this.isCompleted == true && !this.isPendingPO) {
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.isProcessAndAccepted = true;
      this.isPendingPOView = false;
      this.req.fetchPrctReqList(202, this.startDate, this.endDate).subscribe(
        (res: any) => {
          console.log('fetching completed procurement request:', res);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
        },
        (error) => {
          console.log(
            'error while fetching completed procurement request:',
            error,
          );

          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
            this.noRequest = true;
          }
        },
      );
    }
    if(!this.isProcess && !this.isCompleted && this.isPendingPO){
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.isPendingPOView = true;
      this.isProcessAndAccepted = false;
      this.req.fetchPurchaseOrderList(102).subscribe(
        (res) => {
          console.log('fetching pending po list:', res);
          this.userRequest = res;
          this.isSkeletonLoader = false;
          this.noRequest = false;
          this.isEndDateManuallySelected = false;
        },
        (error) => {
          console.log('error while fetching pending po list:', error);
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;

          if (error.status === 404) {
            this.noRequest = true;
            this.userRequest = undefined;
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

  viewModeOfPaymentModal(reqId: number, headOfAccId: number){
    this.reqId = reqId;
    this.selectedHeadOfAccId = headOfAccId;
    this.isViewModeOfPayment = true;
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

    this.req.triggerSearch(enteredIndentCode);
  }

  closeModeOfPaymentModal(closeIcon: boolean){
    this.isViewModeOfPayment = closeIcon;
  }

  refresh(data: any) {
    this.isView = data;
    this.isViewQuoteCompare = data;
    this.isViewConsolidatedQuote = data;
  }
}
