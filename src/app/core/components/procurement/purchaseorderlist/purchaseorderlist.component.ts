import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../service/Request/request.service';
import { Polist } from '../../../models/polist/polist.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-purchaseorderlist',
  templateUrl: './purchaseorderlist.component.html',
  styleUrl: './purchaseorderlist.component.css',
})
export class PurchaseorderlistComponent {
  isCreated: boolean = true;
  noRequest: boolean = false;
  isSkeletonLoader: boolean = true;
  isViewPurchaseOrder: boolean = false;
  isEndDateManuallySelected: boolean = false;
  sortIndentInAscending: boolean = false;
  showSearchInfo: boolean = false;
  isWarningPopUp: boolean = false;

  maxDate: Date | undefined;

  startDate: string | undefined;
  endDate: string | undefined;

  selectedHeadOfAccId: number | null = null;
  reqId: number = 0;
  POId: number = 0;

  confirmPOMsg: string = '';

  POList: Polist[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  requestService = inject(RequestService);

  constructor() {
    this.maxDate = new Date();
  }

  ngOnInit() {   
    this.range.valueChanges.subscribe((val) => {
      const { start, end } = val;
      if (start && end && this.isEndDateManuallySelected) {
        console.log(start, ' ', end);
        this.startDate = this.formatDateOnly(start);
        this.endDate = this.formatDateOnly(end);
        console.log(this.startDate, this.endDate);
        this.fetchPurchaseOrderList();

        this.isEndDateManuallySelected = false;
      }
    });

    this.setTodayDateRange();
  }

  handleFocus(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    this.showSearchInfo = inputValue.trim() === '';
  }

  handleInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    this.showSearchInfo = inputValue.trim() === '';
  }

  fetchPOListByPONumber(event: Event) {
    const enteredPOCode = (event.target as HTMLInputElement).value;
    console.log("enteredPOCode:", enteredPOCode);

    if (enteredPOCode) {
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.requestService.searchPurchaseOrder(enteredPOCode).subscribe(
        (res: Polist[]) => {
          console.log('successfully fetching search PO List:', res);
          this.POList = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching search PO List:', error);
          this.noRequest = false;
          this.isSkeletonLoader = false;
        },
      );
    }
  }

  formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  setTodayDateRange() {
    const today = new Date();
    console.log('today:', today);
    this.isEndDateManuallySelected = true;
    this.range.setValue({
      start: today,
      end: today,
    });
  }

  onEndDateSelected(event: any) {
    this.isEndDateManuallySelected = true;
  }

  sortByIndentNo() {
    this.sortIndentInAscending = !this.sortIndentInAscending;

    this.POList.sort((a, b) => {
      return this.sortIndentInAscending ? a.sno - b.sno : b.sno - a.sno;
    });
  }

  fetchPurchaseOrderList() {
    if (this.isCreated) {
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.requestService
        .fetchPurchaseOrderList(this.startDate, this.endDate)
        .subscribe(
          (res) => {
            this.POList = res;
            console.log('fetching purchase order list:', res);
            this.noRequest = false;
            this.isSkeletonLoader = false;
            this.isEndDateManuallySelected = false;
          },
          (error) => {
            console.log('error while fetching purchase order list:', error);
            this.isEndDateManuallySelected = false;

            if (error.status === 404) {
              this.POList = [];
              this.noRequest = true;
              this.isSkeletonLoader = false;
            }
          },
        );
    }
  }

  togglePrdStatus(POId: number) {
    this.POId = POId;
    this.isWarningPopUp = true;
    this.confirmPOMsg = `Are you sure the product has been received?`;
  }

  confirmPOProductStatus(){
    console.log("API Call Pending.");
    this.requestService.updatePOProductStatus(this.POId).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  closepop(closeIcon: boolean) {
    this.isWarningPopUp = closeIcon;
  }

  viewGeneratedPO(sno: number, headOfAccId: number) {
    this.reqId = sno;
    this.selectedHeadOfAccId = headOfAccId;
    this.isViewPurchaseOrder = true;
  }

  refresh(closeIcon: boolean) {
    this.isViewPurchaseOrder = closeIcon;
  }
}
