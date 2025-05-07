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
  isWarningPopUp: boolean = false;

  POProductList: POProductList[] = [];
  selectedPOPrdList: POProductList | undefined;

  currentDate = new Date();

  currentDateString: string = '';
  confirmPOMsg: string = '';

  selectedIndex: number = 0;

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

  toggleCheckBox(prd: POProductList, index: number) {
    // this.isEnableInputArray[index] = !this.isEnableInputArray[index];
    // this.selectedPOPrdList = prd;
    // this.selectedIndex = index;
    // if (!this.isEnableInputArray[index]) {
    //   this.isWarningPopUp = true;
    //   this.confirmPOMsg =
    //     'This will clear your current input. Do you want to continue?';
    // }else{
    //   this.isEnableInputArray[index] = true;
    // }
    
    if (this.isEnableInputArray[index]) {
      // Only show popup if the product wasn't already cleared
      const isAlreadyCleared = prd.receivedQty === 0;

      if (!isAlreadyCleared) {
        this.isWarningPopUp = true;
        this.confirmPOMsg =
          'This will clear your current input. Do you want to continue?';
        this.selectedPOPrdList = prd;
        this.selectedIndex = index;
      } else {
        // Already cleared before, just disable directly
        this.isEnableInputArray[index] = true;
      }
    } else {
      // Checking the box back on — allow directly
      this.isEnableInputArray[index] = true;
    }
  }

  updateReceivedQty(prd: POProductList) {
    if (!prd.receivedQty || prd.receivedQty <= 0) {
      this.isEnableConfirmBtn = false;
      prd.prdQtyValidationError = false;
      return;
    }

    if ((prd.qty ?? 0) < (prd.inputReceivedQty ?? 0) + (prd.receivedQty ?? 0)) {
      console.log(
        '(prd.qty ?? 0) - (prd.receivedQty ?? 0):',
        (prd.inputReceivedQty ?? 0) + (prd.receivedQty ?? 0),
      );
      prd.prdQtyValidationError = true;
      this.isEnableConfirmBtn = false;
    } else {
      prd.prdQtyValidationError = false;
      this.isEnableConfirmBtn = true;
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

  clearPOPrdDetails(){
    this.isEnableConfirmBtn = false;
    if(!this.selectedPOPrdList){
      return;
    }
    this.selectedPOPrdList.receivedQty = 0;
    this.selectedPOPrdList.inputCurrentDate = this.currentDateString;
    this.selectedPOPrdList.prdQtyValidationError = false;
    if (this.selectedIndex !== undefined) {
      this.isEnableInputArray[this.selectedIndex] = true;
    }

    // Clear references so popup doesn't appear again unnecessarily
    this.selectedPOPrdList = null as any;
    this.selectedIndex = -1;

    // Close popup
    this.isWarningPopUp = false;
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

  closepopup(closeIcon: boolean) {
    this.isWarningPopUp = closeIcon;
    this.isEnableInputArray[this.selectedIndex] = true;
    this.selectedPOPrdList = null as any;
    this.selectedIndex = -1;
  }

  closeModal() {
    console.log('clicking close icon');
    this.close.emit(false);
  }
}
