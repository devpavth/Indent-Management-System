import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { POProductList } from '../../../models/proRequestData/pro-requestdata.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-po-productdetails',
  templateUrl: './view-po-productdetails.component.html',
  styleUrl: './view-po-productdetails.component.css',
})
export class ViewPoProductdetailsComponent implements OnInit {
  @Input() selectedPO!: {
    sno: number;
    headOfAccId: number;
  };
  @Output() close = new EventEmitter<boolean>();

  isEnableInput: boolean = false;

  POProductList: POProductList[] = [];

  requestService = inject(RequestService);

  updatePurchaseOrderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updatePurchaseOrderForm = this.fb.group({
      poItems: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.fetchPOProductDetails();
  }

  get phoneForms() {
    return this.updatePurchaseOrderForm.get('poItems') as FormArray;
  }

  fetchPOProductDetails() {
    this.requestService
      .fetchPOProductDetails(this.selectedPO.sno, this.selectedPO.headOfAccId)
      .subscribe(
        (res) => {
          console.log('fetching PO Prd Details:', res);
          this.POProductList = res;
        },
        (error) => {
          console.log('error while fetching PO Prd Details:', error);
        },
      );
  }

  toggleCheckBox() {
    this.isEnableInput = !this.isEnableInput;
  }

  confirmPOPrdStatus(formdata: any) {
    console.log('formdata:', formdata);

    const items = this.fb.group({
      productId: formdata.productId,
      receivedQty: formdata.receivedQty,
      lastReceivedDate: formdata.lastReceivedDate,
    });

    this.phoneForms.push(items);

    console.log(this.phoneForms.value);
  }

  closeModal() {
    console.log('clicking close icon');
    this.close.emit(false);
  }
}
