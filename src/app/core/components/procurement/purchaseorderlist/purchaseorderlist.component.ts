import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../service/Request/request.service';
import { Polist } from '../../../models/polist/polist.model';
import { debounceTime, Subject } from 'rxjs';
import { ToastService } from '../../service/toast/toast.service';

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
  isDelete: boolean = false;
  showPOPrdModal: boolean = false;
  searchTriggered: boolean = false;

  maxDate: Date | undefined;

  startDate: string | undefined;
  endDate: string | undefined;

  selectedHeadOfAccId: number | null = null;
  reqId: number = 0;
  POId: number = 0;

  confirmPOMsg: string = '';
  searchText: string = '';

  POList: Polist[] = [];

  selectedPO: {
    sno: number;
    headOfAccId: number;
    poId: number
  } = {
    sno: 0,
    headOfAccId: 0,
    poId: 0
  };

  deletePurchaseOrder: {
    title: string;
    action: number;
    deleteId: number;
  } = {
    title: '',
    action: 0,
    deleteId: 0,
  };

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  requestService = inject(RequestService);
  toastService = inject(ToastService);

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

    this.searchText = inputValue;

    this.showSearchInfo = inputValue.trim() === '';

    if(inputValue.trim() === ''){
      this.fetchPurchaseOrderList();
    }
  }

  fetchPOListByPONumber(event: Event) {
    const enteredPOCode = (event.target as HTMLInputElement).value;
    console.log('enteredPOCode:', enteredPOCode);

    if (enteredPOCode) {
      this.isSkeletonLoader = true;
      this.noRequest = false;
      this.requestService.searchPurchaseOrder(enteredPOCode).subscribe(
        (res: Polist[]) => {
          console.log('successfully fetching search PO List:', res);
          this.POList = res;
          this.noRequest = false;
          this.isSkeletonLoader = false;
          this.searchTriggered =  true;
        },
        (error) => {
          console.log('error while fetching search PO List:', error);
          this.noRequest = false;
          this.isSkeletonLoader = false;

          if(error.error.status === 204){
            this.toastService.showError(error.error.errorMessege);
            this.noRequest = true;
            this.POList = [];
            this.searchTriggered = true;
          }
        },
      );
    }
  }

  clearSearch(){
    this.searchText = '';

    if(this.searchTriggered){
      this.fetchPurchaseOrderList();
      this.searchTriggered = false;
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
            this.isSkeletonLoader = false;

            if (error.status === 404) {
              this.POList = [];
              this.noRequest = true;
              this.isSkeletonLoader = false;
            }
          },
        );
    }
  }

  openPrdStatus(sno: number, headOfAccId: number, poId: number, poStatus: number) {
    this.selectedPO = { sno: sno, headOfAccId: headOfAccId, poId: poId};
    if(poStatus === 201 || poStatus === 206){
      this.showPOPrdModal = true;
    }
  }

  toggledelete(check: number, isView: boolean, id: number) {
    if (check === 1) {
      this.isDelete = isView;
      this.deletePurchaseOrder = {
        title: 'Purchase Order',
        action: 7,
        deleteId: id,
      };
    } else if (check === 0) {
      this.isDelete = isView;
    }
  }

  deletePO() {
    this.fetchPurchaseOrderList();
  }

  confirmPOProductStatus() {
    console.log('API Call Pending.');
    console.log('POId after OK:', this.POId);
    this.requestService.updatePOProductStatus(this.POId).subscribe(
      (res: any) => {
        console.log('successfully changed product Status in PO:', res);
        this.toastService.showSuccess(res.errorMessege);
        this.fetchPurchaseOrderList();
      },
      (error) => {
        console.log('error while changing product Status in PO:', error);
      },
    );
  }

  viewGeneratedPO(sno: number, headOfAccId: number) {
    this.reqId = sno;
    this.selectedHeadOfAccId = headOfAccId;
    this.isViewPurchaseOrder = true;
  }

  refresh(closeIcon: boolean) {
    this.isViewPurchaseOrder = closeIcon;
  }

  closeModal(closeIcon: boolean){
    console.log('Parent: received close', closeIcon);
    this.showPOPrdModal = closeIcon;
  }
}
