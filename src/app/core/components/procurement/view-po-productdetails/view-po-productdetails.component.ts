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
  skeletonLoader: boolean = true;
  btnLoader: boolean = false;
  isDisableCheckBox: boolean = false;

  POProductList: POProductList[] = [];

  selectedIndices: number[] = [];

  currentDate = new Date();

  currentDateString: string = '';

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
          const month = (this.currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0');
          const day = this.currentDate.getDate().toString().padStart(2, '0');
          this.currentDateString = `${year}-${month}-${day}`;
          this.POProductList = res.map((prd: POProductList) => ({
            ...prd,
            inputReceivedQty: prd.receivedQty,
            receivedQty: 0,
            inputCurrentDate:
              prd.lastReceivedDate === null
                ? this.currentDateString
                : prd.lastReceivedDate,
          }));
          this.isEnableInputArray = new Array(res.length).fill(false);
          this.skeletonLoader = false;
        },
        (error) => {
          console.log('error while fetching PO Prd Details:', error);
          this.skeletonLoader = false;
        },
      );
  }

  toggleCheckBox(event: Event, prd: POProductList, index: number) {
    const input = event.target as HTMLInputElement;
    if(!input) return;

    let checked = input.checked;
    console.log("checked:", checked);

    this.isEnableInputArray[index] = checked;
    
    if(checked){
      if(!this.selectedIndices.includes(index)){
        this.selectedIndices.push(index);
        console.log('this.selectedIndices:', this.selectedIndices);
      } else{
        console.log("this.selectedIndices:", this.selectedIndices);

        prd.receivedQty = 0;
        prd.prdQtyValidationError = false;
        prd.prdZeroQtyValidationError = false;
        prd.inputCurrentDate = this.currentDateString;
        this.selectedIndices = this.selectedIndices.filter((i) => i !== index);
      }

      const hasInvalidQty = this.selectedIndices.some(
        (i) => this.POProductList[i].receivedQty === 0
      );

      if(hasInvalidQty){
        this.isEnableConfirmBtn = false;

        this.selectedIndices.forEach(
          (i) => {
            if(this.POProductList[i].receivedQty === 0){
              this.POProductList[i].prdZeroQtyValidationError = true;
            }
          }
        )
      } else{
        this.isEnableConfirmBtn = true;
      }
    } else{
      prd.receivedQty = 0;
      prd.prdQtyValidationError = false;
      prd.prdZeroQtyValidationError = false;
      prd.inputCurrentDate = this.currentDateString;
      this.selectedIndices = this.selectedIndices.filter((i) => i !== index);
      if(this.selectedIndices.length > 0){
        const hasError = this.selectedIndices.some(
          (i) => this.POProductList[i].prdZeroQtyValidationError === true || this.POProductList[i].prdQtyValidationError === true 
        )

        this.isEnableConfirmBtn = !hasError; 
      } else{
        this.isEnableConfirmBtn = false;
      }

      console.log('this.selectedIndices:', this.selectedIndices);
      console.log('this.isEnableConfirmBtn:', this.isEnableConfirmBtn);
    }   
  }

  updateReceivedQty(event: Event, prd: POProductList) {
    const input = (event.target as HTMLInputElement);
    const inputQty = Number(input.value);
    
    if(inputQty < 1){
      prd.receivedQty = undefined;
      input.value = '';
      prd.prdZeroQtyValidationError = true;
      prd.prdQtyValidationError = false;
      this.isEnableConfirmBtn = false;
      return;
    }

    prd.prdZeroQtyValidationError = false;

    if ((prd.qty ?? 0) < (prd.inputReceivedQty ?? 0) + (prd.receivedQty ?? 0)) {
      console.log(
        '(prd.qty ?? 0) - (prd.receivedQty ?? 0):',
        (prd.inputReceivedQty ?? 0) + (prd.receivedQty ?? 0),
      );
      prd.prdQtyValidationError = true;
      prd.prdZeroQtyValidationError = false;
      this.isEnableConfirmBtn = false;
    } else {
      prd.prdQtyValidationError = false;
    }

    const formArray = this.poPrdItems;

    const existingIndex = formArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.get('productId')?.value === prd.productId,
    );

    if (existingIndex === -1) {
      console.log('inside if condition');
      console.log(
        '(prd.qty ?? 0) - (prd.receivedQty ?? 0):',
        (prd.inputReceivedQty ?? 0) + (prd.receivedQty ?? 0),
      );
      formArray.push(
        this.fb.group({
          productId: [prd.productId],
          receivedQty: [prd.receivedQty],
          lastReceivedDate: [prd.inputCurrentDate],
        }),
      );
      console.log('inside if condition formArray:', formArray.value);
    } else {
      console.log('inside else condition');
      console.log(
        '(prd.qty ?? 0) - (prd.receivedQty ?? 0):',
        (prd.inputReceivedQty ?? 0) + (prd.receivedQty ?? 0),
      );
      formArray.at(existingIndex).patchValue({
        receivedQty: prd.receivedQty,
        lastReceivedDate: prd.inputCurrentDate,
      });
      console.log('inside else condition formArray:', formArray.value);
    }

    const hasInvalidQty = this.selectedIndices.some(
      (i) => this.POProductList[i].receivedQty === 0,
    );

    this.isEnableConfirmBtn = !hasInvalidQty && !prd.prdQtyValidationError;

    if(this.selectedIndices.length > 0){
      const hasError = this.selectedIndices.some(
        (i) => this.POProductList[i].prdZeroQtyValidationError === true || this.POProductList[i].prdQtyValidationError === true
      );

      this.isEnableConfirmBtn = !hasError;
    } else{
      this.isEnableConfirmBtn = false;
    }
    console.log('this.selectedIndices:', this.selectedIndices);
    console.log('this.isEnableConfirmBtn:', this.isEnableConfirmBtn);
  }

  updateReceivedDate(prd: POProductList) {
    const formArray = this.poPrdItems;

    const existingIndex = formArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.get('productId')?.value === prd.productId,
    );

    if (existingIndex === -1) {
      formArray.push(
        this.fb.group({
          productId: [prd.productId],
          receivedQty: [prd.receivedQty],
          lastReceivedDate: [prd.lastReceivedDate],
        }),
      );
      console.log('formArray in if condition:', formArray.value);
    } else {
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
      if (this.isEnableInputArray[i]) {
        prd.lastReceivedDate = prd.inputCurrentDate;
        this.updateReceivedDate(prd);
      }
    });

    if (this.updatePurchaseOrderForm.valid) {
      const payload = this.updatePurchaseOrderForm.value.poItems;
      console.log('Payload to send:', payload);

      this.btnLoader = true;
      this.requestService
        .updatePOPrdDetails(this.selectedPO.poId, payload)
        .subscribe(
          (res: any) => {
            console.log('updating PO Prd Form successfully:', res);
            this.toastService.showSuccess(res.errorMessege);
            setTimeout(() => {
              this.close.emit(false);
              this.route.navigate(['/home/POList']);
            }, 3000);
          },
          (error) => {
            console.log('error while updating the PO Prd Form:', error);
            this.btnLoader = false;
          },
        );
    }
  }

  closeModal() {
    console.log('clicking close icon');
    this.close.emit(false);
  }
}
