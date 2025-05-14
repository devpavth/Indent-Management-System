import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { ToastService } from '../../service/toast/toast.service';
import { Request } from '../../../models/request/request.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-requisition-list',
  templateUrl: './requisition-list.component.html',
  styleUrl: './requisition-list.component.css',
})
export class RequisitionListComponent implements OnInit {
  maxDate: Date | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  isViewSelectedDate: boolean = true;
  noRequest: boolean = false;
  showSearchInfo: boolean = false;
  isSkeletonLoader: boolean = true;
  isEndDateManuallySelected: boolean = false;
  isProcess = true;
  isCompleted = false;
  isHold = false;
  isRejected = false;
  isView = false;

  searchText: string = '';

  userRequest: any;
  reqId: any;

  toastService = inject(ToastService);

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit() {
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
      if (start && end && this.isEndDateManuallySelected) {
        this.startDate = this.formatDateOnly(start);
        this.endDate = this.formatDateOnly(end);

        this.fetchRequestList();
        this.isEndDateManuallySelected = false;
      }
    });

    this.fetchRequestList();
  }

  constructor(private req: RequestService) {
    const today = new Date();
    this.maxDate = new Date();
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
      this.isHold == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.req.finRequestList(status).subscribe(
        (res) => {
          this.userRequest = res;
          console.log('fetching finance request processing list:', res);
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log(
            'error while fetching processing finance request:',
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
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.req.finRequestList(202, this.startDate, this.endDate).subscribe(
        (res: any) => {
          console.log('fetching completed finance request:', res);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
        },
        (error) => {
          console.log('error while fetching completed finance request:', error);
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
    if (
      this.isProcess == false &&
      this.isCompleted == false &&
      this.isHold == true &&
      this.isRejected == false
    ) {
      this.isViewSelectedDate = false;
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.req.finRequestList(418).subscribe(
        (res: any) => {
          console.log('fetching finance request on hold list:', res);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching on hold finance request:', error);
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
      this.isCompleted == false &&
      this.isHold == false &&
      this.isRejected == true
    ) {
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.searchText = '';
      this.req.finRequestList(406, this.startDate, this.endDate).subscribe(
        (res: any) => {
          console.log('fetching finance request rejected list:', res);
          this.userRequest = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
          this.isEndDateManuallySelected = false;
        },
        (error) => {
          console.log('error while fetching rejected finance request:', error);
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

  viewRequest(data: any) {
    console.log(data);
    this.reqId = data;
    this.isView = true;
  }
  refresh(data: any) {
    this.isView = data;
  }
}
