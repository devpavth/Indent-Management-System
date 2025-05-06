import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { POProductList } from '../../../models/proRequestData/pro-requestdata.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../service/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-po-productdetails',
  templateUrl: './view-po-productdetails.component.html',
  styleUrl: './view-po-productdetails.component.css',
})
export class ViewPoProductdetailsComponent implements OnInit {
  @Input() selectedPO!: {
    sno: number;
    headOfAccId: number;
    poId: number;
  };
  @Output() close = new EventEmitter<boolean>();
  
  isEnableInputArray: boolean[] = [];

  isEnableConfirmBtn: boolean = false;

  POProductList: POProductList[] = [];

  currentDate = new Date();

  requestService = inject(RequestService);
  toastService = inject(ToastService);
  route = inject(Router);

  updatePurchaseOrderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updatePurchaseOrderForm = this.fb.group({
      poItems: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.fetchPOProductDetails();
  }

  get poPrdItems() {
    return this.updatePurchaseOrderForm.get('poItems') as FormArray;
  }

  fetchPOProductDetails() {
    this.requestService
      .fetchPOProductDetails(this.selectedPO.sno, this.selectedPO.headOfAccId)
      .subscribe(
        (res) => {
          console.log('fetching PO Prd Details:', res);
          const year = this.currentDate.getFullYear();
          const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
          const day = this.currentDate.getDate().toString().padStart(2, '0');
          const dateString = `${year}-${month}-${day}`;
          this.POProductList = res.map((prd: POProductList) => ({
            ...prd,
            inputReceivedQty: 0,
            inputCurrentDate: dateString,
          }));
          this.isEnableInputArray = new Array(res.length).fill(false);
        },
        (error) => {
          console.log('error while fetching PO Prd Details:', error);
        },
      );
  }

  toggleCheckBox(prd: POProductList,index: number) {
    this.isEnableInputArray[index] = !this.isEnableInputArray[index];
    this.isEnableConfirmBtn = false;
    prd.inputReceivedQty = 0;
  }

  updateReceivedQty(prd: POProductList) {
    const formArray = this.poPrdItems;

    const existingIndex = formArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.get('productId')?.value === prd.productId
    )

    if(existingIndex === -1){
      console.log('inside if condition');
      formArray.push(
        this.fb.group({
          productId: [prd.productId],
          receivedQty: [prd.receivedQty],
          lastReceivedDate: [prd.lastReceivedDate],
        }),
      );
      console.log('inside if condition formArray:', formArray.value);
    } else{
      console.log('inside else condition');
      formArray.at(existingIndex).patchValue({
        receivedQty: prd.receivedQty,
        lastReceivedDate: prd.lastReceivedDate,
      });
      console.log('inside else condition formArray:', formArray.value);
    }

    if (prd.inputReceivedQty === 0) {
      this.isEnableConfirmBtn = false;
    } else{
      this.isEnableConfirmBtn = true;
    }
    
  }

  updateReceivedDate(prd: POProductList) {
    prd.lastReceivedDate = prd.inputCurrentDate;
    const formArray = this.poPrdItems;

    const existingIndex = formArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.get('productId')?.value === prd.productId
    )

    if(existingIndex === -1){
      formArray.push(
        this.fb.group({
          productId: [prd.productId],
          receivedQty: [prd.receivedQty],
          lastReceivedDate: [prd.lastReceivedDate],
        }),
      );
      console.log('formArray in if condition:', formArray.value);
    } else{
      formArray.at(existingIndex).patchValue({
        receivedQty: prd.receivedQty,
        lastReceivedDate: prd.lastReceivedDate,
      });
      console.log('formArray in else condition:', formArray.value);
    }

    if (prd.receivedQty === 0) {
      this.isEnableConfirmBtn = false;
    } else {
      this.isEnableConfirmBtn = true;
    }
  }

  confirmPOPrdStatus() {
    this.POProductList.forEach((prd, i) => {
      if(this.isEnableInputArray[i]){
        prd.receivedQty = prd.inputReceivedQty
        this.updateReceivedQty(prd);
      }
    })
    if (this.updatePurchaseOrderForm.valid) {
      const payload = this.updatePurchaseOrderForm.value.poItems;
      console.log('Payload to send:', payload);

      // this.requestService
      //   .updatePOPrdDetails(this.selectedPO.poId, payload)
      //   .subscribe(
      //     (res: any) => {
      //       console.log('updating PO Prd Form successfully:', res);
      //       this.toastService.showSuccess(res.errorMessege);
      //       setTimeout(() => {
      //         this.close.emit(false);
      //         this.route.navigate(['/home/POList']);
      //       }, 3000);
      //     },
      //     (error) => {
      //       console.log('error while updating the PO Prd Form:', error);
      //     },
      //   );
    }
  }

  closeModal() {
    console.log('clicking close icon');
    this.close.emit(false);
  }
}
