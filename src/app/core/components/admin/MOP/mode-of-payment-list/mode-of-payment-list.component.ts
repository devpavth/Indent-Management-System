import { Component, inject, OnInit } from '@angular/core';
import { RequestService } from '../../../service/Request/request.service';
import { Modeofpayment } from '../../../../models/modeofpayment/modeofpayment.model';

@Component({
  selector: 'app-mode-of-payment-list',
  templateUrl: './mode-of-payment-list.component.html',
  styleUrl: './mode-of-payment-list.component.css',
})
export class ModeOfPaymentListComponent implements OnInit {
  modeOfPaymentId: number = 0;
  modeOfPayment: string = '';

  isAddModeOfPaymentModal: boolean = false;
  isSkeletonLoader: boolean = false;
  isDelete: boolean = false;
  noModeOfPayment: boolean = false;

  modeOfPaymentList: Modeofpayment[] = [];

  deleteProduct: { title: string, action: number, deleteId: number} = { title: '', action: 0, deleteId: 0}

  requestService = inject(RequestService);

  ngOnInit() {
    this.fetchModeOfPaymentList();
  }

  fetchModeOfPaymentList() {
    this.isSkeletonLoader = true;
    this.requestService.fetchModeOfPaymentsList().subscribe(
      (res) => {
        console.log('successfully fetching mode of payment List:', res);
        this.modeOfPaymentList = res;
        this.isSkeletonLoader = false;
        this.noModeOfPayment = false;
      },
      (error) => {
        console.log('error while fetching mode of payment list:', error);
        this.isSkeletonLoader = false;

        if(error.status === 404){
          this.noModeOfPayment = true;
        }
      },
    );
  }

  addModeOfPayment() {
    this.isAddModeOfPaymentModal = true;
  }

  updateModeOfPayment(modeOfPaymentId: number, modeOfPayment: string) {
    this.modeOfPayment = modeOfPayment;
    this.modeOfPaymentId = modeOfPaymentId;
    this.isAddModeOfPaymentModal = true;
  }

  toggleDelete(check: number, modeOfPaymentId: number, isView: boolean) {
    if(check === 1){
      this.isDelete = isView;
      this.deleteProduct = {
        title: 'Mode Of Payment',
        action: 8,
        deleteId: modeOfPaymentId,
      };
      console.log('this.deleteProduct:', this.deleteProduct);
    } else if(check === 0){
      this.isDelete= isView;
    }
  }

  closeAddMOPModal(closeIcon: boolean) {
    this.isAddModeOfPaymentModal = closeIcon;
    this.modeOfPayment = '';
  }
}
