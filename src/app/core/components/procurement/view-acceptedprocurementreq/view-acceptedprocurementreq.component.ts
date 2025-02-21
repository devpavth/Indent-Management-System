import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
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
  @Input() indentNumber: string = '';
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

        this.uniqueProductHeadData.unshift({
          headOfAccId: 0,
          headOfAccName: 'All',
          id: 0,
          itemTotalPrice: 0,
          prdCode: '',
          prdDescription: '',
          prdGstPct: 0,
          prdHsnCode: 0,
          prdStatus: 0,
          prdUnit: 0,
          prdbrndName: '',
          prdcatgName: '',
          prdgrpName: '',
          prdmdlName: '',
          productId: 0,
          qty: 0,
          unitPrice: 0,
        });

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
    // this.requestService.fetchQuoteComparison(this.reqId, headOfAccId).subscribe(
    //   (res: QuoteComparison) => {
    //     console.log('fetching quote data based on headofaccid:', res);
    //     this.indentQuoteComparison = res;
    //     console.log(
    //       'this.indentQuoteComparison:',
    //       this.indentQuoteComparison.qcHeadOfAcc[0].qcVendors.map(
    //         (vendor) => vendor.assgndVendorData.vendorName,
    //       ),
    //     );
    //     this.selectedVendorname =
    //       this.indentQuoteComparison.qcHeadOfAcc[0].qcVendors.map(
    //         (vendor) => vendor.assgndVendorData.vendorName,
    //       );

    //     this.leastQuotedVendorData = this.getLeastQuotedVendorData(headOfAccId);

    //     console.log('leastQuotedVendorData:', this.leastQuotedVendorData);
    //   },
    //   (error) => {
    //     console.log('error while fetching quote data:', error);
    //   },
    // );

    this.filterProductHeadData = this.productHeadData.filter(
      (pro: indentProductList) => pro.headOfAccId === headOfAccId,
    );

    console.log('this.filterProductHeadData:', this.filterProductHeadData);
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
