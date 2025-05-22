import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RequestService } from '../../core/components/service/Request/request.service';
import { Modeofpayment } from '../../core/models/modeofpayment/modeofpayment.model';
import { ToastService } from '../../core/components/service/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mode-of-payment-modal',
  templateUrl: './mode-of-payment-modal.component.html',
  styleUrl: './mode-of-payment-modal.component.css',
})
export class ModeOfPaymentModalComponent implements OnInit {
  @Input() reqId!: number;
  @Input() headOfAccId!: number;
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() callPendingPOApi = new EventEmitter<void>();

  selectedModeOfPaymentId: number = 0;

  isSuccessPopup: boolean = false;

  successData: { show: number, text: string} = {
    show: 0,
    text: ''
  }

  modeOfPaymentList: Modeofpayment[] = [];

  requestService = inject(RequestService);
  toastService = inject(ToastService);
  router = inject(Router);

  ngOnInit() {
    this.fetchActiveModeOfPaymentsList();
  }

  fetchActiveModeOfPaymentsList() {
    this.requestService.fetchModeOfPaymentsList().subscribe(
      (res: Modeofpayment[]) => {
        console.log('fetching mode of payment list:', res);
        this.modeOfPaymentList = res;
      },
      (error) => {
        console.log('error while fetching mode of payment list:', error);
      },
    );
  }

  selectedModeOfPayment(event: Event){
    const inputElement = event.target as HTMLSelectElement;
    this.selectedModeOfPaymentId = Number(inputElement.value);
  }

  confirmModeOfPayment(){
    this.requestService.generatePurchaseOrderPDF(this.reqId, this.headOfAccId, this.selectedModeOfPaymentId).subscribe(
      (res: any) => {
        console.log("successfully generated purchase order:", res);
        this.toastService.showSuccess('Purchase Order Converted Successfully');
        this.isSuccessPopup = true;
        this.successData = { show: 8, text: res.errorMessege};
      },
      (error) => {
        console.log("error while generating PO:", error);
      }
    )
  }

  togglePopup(closeIcon: boolean){
    this.isSuccessPopup = closeIcon;
    this.closeModal.emit(false);
    this.callPendingPOApi.emit();
  }
}
