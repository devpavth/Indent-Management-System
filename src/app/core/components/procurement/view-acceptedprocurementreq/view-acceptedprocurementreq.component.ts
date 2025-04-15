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
  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];
  filterProductHeadData: indentProductList[] = [];
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

  isLoading: boolean = false;
  isViewPurchaseOrder: boolean = false;

  tooltipSno: number | null = null;
  pdfURL: SafeResourceUrl | null = null;

  ngOnInit() {
    console.log('reqId:', this.reqId);

    this.fetchDetails(this.reqId);
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

    if (this.selectedHeadOfAccId || this.selectedHeadOfAccId === 0) {
      this.fetchQuote(this.selectedHeadOfAccId);
    }

    console.log('Selected headOfAccId:', this.selectedHeadOfAccId);
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
  }

  viewPurchaseOrderReport() {
    const indentStatus = this._requestDetails().indentHeaders.requestStatus;
    if (indentStatus === 100) {
      this.isViewPurchaseOrder = true;
    }
  }

  showTooltipForFewSec(sno: number){
    this.tooltipSno = sno;
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
