import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../../service/Request/request.service';
import { Modeofpayment } from '../../../../models/modeofpayment/modeofpayment.model';

@Component({
  selector: 'app-mode-of-payment-list',
  templateUrl: './mode-of-payment-list.component.html',
  styleUrl: './mode-of-payment-list.component.css',
})
export class ModeOfPaymentListComponent implements OnInit {
  modeOfPaymentList: Modeofpayment[] = [];

  requestService = inject(RequestService);
  
  ngOnInit(){
    this.fetchModeOfPaymentList();
  }

  fetchModeOfPaymentList(){
    this.requestService.fetchModeOfPaymentsList().subscribe(
      (res) => {
        console.log("successfully fetching mode of payment List:", res);
        this.modeOfPaymentList = res;
      },
      (error) => {
        console.log("error while fetching mode of payment list:", error);
      }
    )
  }
}
