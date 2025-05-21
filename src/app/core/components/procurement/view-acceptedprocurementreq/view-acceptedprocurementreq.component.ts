import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { indentProductList } from '../../../models/proRequestData/pro-requestdata.model';
import { QuoteComparison } from '../../../models/quoteComparison/quote-comparison.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastService } from '../../service/toast/toast.service';

@Component({
  selector: 'app-view-acceptedprocurementreq',
  templateUrl: './view-acceptedprocurementreq.component.html',
  styleUrl: './view-acceptedprocurementreq.component.css',
})
export class ViewAcceptedprocurementreqComponent {
  @Input() reqId: number = 0;
  @Input() indentNumber: string | undefined = '';
  @Output() closeView = new EventEmitter<boolean>();
  _requestDetails = signal<any>(null);
  requestService = inject(RequestService);
  sanitizer = inject(DomSanitizer);
  toastService = inject(ToastService);
  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];
  filterProductHeadData: indentProductList[] = [];
  filterHeadOfAcc: any;
  indentQuoteComparison: QuoteComparison | undefined;
  selectedVendorname: string[] = [];
  vendorQuotedPrice: number[] = [];
  selectedHeadOfAccId: number | null = null;
  leastQuotedVendorData:
    | {
        leastVendorName: string;
        leastPrice: number | string;
      }
    | undefined;
  successData: { show: number; text: string } = {
    show: 0,
    text: '',
  };

  isLoading: boolean = false;
  isViewPurchaseOrder: boolean = false;
  isWarningPopUp: boolean = false;
  dynamicPOBtn: boolean = false;
  isSuccesPop: boolean = false;
  showBtn: boolean = false;

  confirmPOMsg: string = '';
  selectedHeadOfAccName: string = '';

  tooltipSno: number | null = null;
  pdfURL: SafeResourceUrl | null = null;

  ngOnInit() {
    console.log('reqId:', this.reqId);

    this.fetchDetails(this.reqId);
    this.verifyQuoteComparisonHeadOfAcc(this.reqId);
  }

  fetchDetails(reqId: number) {
    this.requestService.viewReq(reqId).subscribe(
      (res) => {
        console.log('fetching indent request details:', res);
        this._requestDetails.set(res);
        this.productHeadData = this._requestDetails()?.productDetails;

        this.uniqueProductHeadData = [
          ...new Map(
            this.productHeadData.map((item) => [item.headOfAccName, item]),
          ).values(),
        ];

        console.log('this.uniqueProductHeadData:', this.uniqueProductHeadData);

        console.log(
          'this.uniqueProductHeadData after all:',
          this.uniqueProductHeadData,
        );

        if (this.uniqueProductHeadData.length > 0) {
          console.log('checking');
          this.selectedHeadOfAccId = this.uniqueProductHeadData[0].headOfAccId;
          this.selectedHeadOfAccName =
            this.uniqueProductHeadData[0].headOfAccName;
          console.log('this.selectedHeadOfAccId:', this.selectedHeadOfAccId);
          this.selectedHeadOfAcc(this.selectedHeadOfAccId);
        }
      },
      (error) => {
        console.log('error while fetching indent request details:', error);
      },
    );
  }

  selectedHeadOfAcc(event: Event | number) {
    if (typeof event === 'number') {
      console.log('checking if condition');
      this.selectedHeadOfAccId = event;
      console.log(
        'this.selectedHeadOfAccId in if condition:',
        this.selectedHeadOfAccId,
      );
    } else {
      console.log('checking else condition');
      const selectElement = event.target as HTMLSelectElement;
      this.selectedHeadOfAccId = Number(selectElement.value);
    }

    if (this.selectedHeadOfAccId) {
      const selectedItem = this.filterHeadOfAcc.find(
        (item: any) => item.headOfAccId === this.selectedHeadOfAccId,
      );
      this.dynamicPOBtn = selectedItem?.poStatus === 102;
      this.showBtn = true;
      this.fetchQuote(this.selectedHeadOfAccId);
    }

    console.log('Selected headOfAccId:', this.selectedHeadOfAccId);
  }

  verifyQuoteComparisonHeadOfAcc(sno: number) {
    this.requestService.verifyQuoteComparisonHeadOfAcc(sno).subscribe(
      (res) => {
        console.log('verifying quote compare headofacc:', res);
        this.filterHeadOfAcc = res;
        console.log('checking selectedHeadOfAccId:', this.selectedHeadOfAccId);
        if (this.selectedHeadOfAccId) {
          console.log(
            'checking selectedHeadOfAccId in if condition:',
            this.selectedHeadOfAccId,
          );
          const selectedItem = this.filterHeadOfAcc.find(
            (item: any) => item.headOfAccId === this.selectedHeadOfAccId,
          );

          console.log('selectedItem in BTN:', selectedItem);
          console.log('selectedItem in postatus:', selectedItem?.poStatus);
          this.dynamicPOBtn = selectedItem?.poStatus === 102;
          this.showBtn = true;
        }

        console.log('dynamic PO Btn:', this.dynamicPOBtn);
      },
      (error) => {
        console.log('error while verifying headOfacc:', error);
      },
    );
  }

  fetchQuote(headOfAccId: number) {
    console.log('headOfAccId in fetchQuote:', headOfAccId);
    this.isLoading = true;
    this.requestService
      .fetchQuoteComparisonPDF(this.reqId, headOfAccId)
      .subscribe(
        (res: Blob) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const objectUrl = window.URL.createObjectURL(blob);
          this.pdfURL =
            this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          console.log('Fetching comparison quote pdf:', res);
          this.isLoading = false;
        },
        (error) => {
          console.log('error while fetching comparison quote pdf', error);
          this.isLoading = false;
        },
      );

    this.filterProductHeadData = this.productHeadData.filter(
      (pro: indentProductList) => pro.headOfAccId === headOfAccId,
    );

    console.log('this.filterProductHeadData:', this.filterProductHeadData);

    this.selectedHeadOfAccName = this.filterProductHeadData[0].headOfAccName;
  }

  confirmPOPopup() {
    const indentStatus = this._requestDetails().indentHeaders.requestStatus;
    if (indentStatus === 100) {
      if (this.dynamicPOBtn) {
        this.isWarningPopUp = true;
        this.confirmPOMsg = `Are you sure want to convert this '${this.selectedHeadOfAccName}' into Purchase Order?`;
      } else {
        this.isViewPurchaseOrder = true;
      }
    }
  }

  showTooltipForFewSec(sno: number) {
    this.tooltipSno = sno;
  }

  confirmPurchaseOrderReport() {
    this.requestService
      .generatePurchaseOrderPDF(this.reqId, this.selectedHeadOfAccId)
      .subscribe(
        (res: any) => {
          console.log('fetching purchase order details:', res);
          this.toastService.showSuccess(
            'Purchase Order Converted Successfully',
          );
          this.isSuccesPop = true;
          this.successData = { show: 8, text: res.errorMessege };
          this.verifyQuoteComparisonHeadOfAcc(this.reqId);
        },
        (error) => {
          console.log('error while fetching purchase order details:', error);

          if (error.status === 400) {
            this.toastService.showError(error.error.errorMessege);
          }
        },
      );
  }

  closepop(closeIcon: boolean) {
    this.isWarningPopUp = closeIcon;
  }

  togglePop(closeIcon: boolean) {
    this.isSuccesPop = closeIcon;
  }

  refresh(closeIcon: boolean) {
    this.isViewPurchaseOrder = closeIcon;
  }

  getAllQuotedPrices() {
    return this.filterProductHeadData.map((product) => ({
      ...product,
      quotedPrices: this.getQuotedPricesByProductId(product.productId),
    }));
  }

  getQuotedPricesByProductId(productId: number) {
    return this.indentQuoteComparison?.qcHeadOfAcc[0].qcVendors.map(
      (vendor) => {
        const product = vendor.qcProducts.find(
          (pro) => pro.productDetailsDTO.productId === productId,
        );
        return product ? product.quotedPrice : null;
      },
    );
  }

  getLeastQuotedVendorData(headOfAccId: number | null) {
    const headOfAcc = this.indentQuoteComparison?.qcHeadOfAcc.find(
      (acc) => acc.headOfAccId === headOfAccId,
    );
    return headOfAcc
      ? {
          leastVendorName: headOfAcc.leastQuotedVendorName,
          leastPrice: headOfAcc.leastPrice,
        }
      : { leastVendorName: 'N/A', leastPrice: 'N/A' };
  }
}
