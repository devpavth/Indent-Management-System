import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { indentProductList } from '../../../models/proRequestData/pro-requestdata.model';

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
  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];
  filterProductHeadData: indentProductList[] = [];

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
      },
      (error) => {
        console.log('error while fetching indent request details:', error);
      },
    );
  }

  selectedHeadOfAcc(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const headOfAccId = Number(selectElement.value);

    console.log('Selected headOfAccId:', headOfAccId);

    this.filterProductHeadData = this.productHeadData.filter(
      (pro: indentProductList) => pro.headOfAccId === headOfAccId,
    );

    console.log('this.filterProductHeadData:', this.filterProductHeadData);
  }

  printPage(){
    window.print();
  }
}
