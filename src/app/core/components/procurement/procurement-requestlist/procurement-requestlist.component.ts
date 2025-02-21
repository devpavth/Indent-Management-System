import { Component, ElementRef, HostListener } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-procurement-requestlist',
  templateUrl: './procurement-requestlist.component.html',
  styleUrl: './procurement-requestlist.component.css',
})
export class ProcurementRequestlistComponent {
  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;
  private closeDropdownTimeout: ReturnType<typeof setTimeout> | null = null;
  ngOnInit() {
    console.log('checking procurement list');
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
  selectedRequestId: number | null = null;

  reqId: any;
  indentNumber: string = '';

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
        },
        (error) => {
          console.log(
            'error while fetching processing procurement request:',
            error,
          );
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
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
        },
        (error) => {
          console.log(
            'error while fetching completed procurement request:',
            error,
          );
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
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
      this.req.fetchPrctReqList(418).subscribe(
        (res: any) => {
          console.log('fetching procurement request on hold list:', res);
          this.userRequest = res;
        },
        (error) => {
          console.log(
            'error while fetching on hold procurement request:',
            error,
          );
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
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
      this.req.fetchPrctReqList(406, this.currentDate).subscribe(
        (res: any) => {
          console.log('fetching procurement request rejected list:', res);
          this.userRequest = res;
        },
        (error) => {
          console.log(
            'error while fetching rejected procurement request:',
            error,
          );
          if (error.status == 204) {
            this.userRequest = undefined;
          } else if (error.status === 404) {
            this.userRequest = undefined;
          }
        },
      );
    }
  }

  viewRequest(event: Event, data: number, indentNO: string) {
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
      this.isViewQuoteCompare = true;
    }
  }

  openConsolidatedQuote(sno: number){
    console.log('sno in openConsolidatedQuote:', sno);
    this.reqId = sno;

    if(this.isCompleted === true){
      this.isViewConsolidatedQuote = true;
    }
  }

  refresh(data: any) {
    this.isView = data;
    // this.isAcceptedView = data;
    this.isViewQuoteCompare = data;
    this.isViewConsolidatedQuote = data;
    this.fetchRequestList();
  }
}
