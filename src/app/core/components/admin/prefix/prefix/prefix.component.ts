import {
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../service/Request/request.service';
import { Prefix } from '../../../../models/prefix/prefix.model';
import { ToastService } from '../../../service/toast/toast.service';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-prefix',
  templateUrl: './prefix.component.html',
  styleUrl: './prefix.component.css',
})
export class PrefixComponent {
  @Output() close = new EventEmitter<boolean>();
  isStyle: boolean = false;
  selectedTab: number = 0;

  route = inject(Router);
  requestService = inject(RequestService);
  toastService = inject(ToastService);
  branchService = inject(BranchService);

  tabs: string[] = ['Indent Code', 'Purchase Order', 'Product Transaction'];

  POPrefixData: Prefix | undefined;
  isWarningFYPrefixPO: boolean = false;
  isPrefixChanged: boolean = false;
  isRunYearEndProcessBtn: boolean = false;
  initialFirstCustomValue: string = '';
  initialBranchStatus!: boolean;
  initailDeptStatus!: boolean;
  initialLastCustomValue: string = '';
  initialTransTypeStatus!: boolean;

  ngOnInit() {
    console.log('Opening Prefix Component');

    this.onTabSelect(0);
  }

  onTabSelect(index: number) {
    this.selectedTab = index;

    const POCode = index + 1;

    this.isPrefixChanged = false;

    this.fetchPOMockPrefixCode(POCode);
  }

  fetchPOMockPrefixCode(POCode: number) {
    this.requestService.fetchPOPrefixCode(POCode).subscribe(
      (res: Prefix) => {
        console.log('fetching POMock Prefix Code:', res);
        this.POPrefixData = res;

        this.initialFirstCustomValue = this.POPrefixData.firstCustomValue;
        this.initialBranchStatus = this.POPrefixData.branch;
        this.initailDeptStatus = this.POPrefixData.dept;
        this.initialLastCustomValue = this.POPrefixData.lastCustomValue;
        this.initialTransTypeStatus = this.POPrefixData.transactionType;

        if(this.POPrefixData.fyChangedOn){
          const fyChangedYear = new Date(this.POPrefixData.fyChangedOn).getFullYear();
          const currentYear = new Date().getFullYear();

          this.isRunYearEndProcessBtn = fyChangedYear === currentYear - 1;

        }else{
          this.isRunYearEndProcessBtn = false;
        }
      },
      (error) => {
        console.log('error while fetching PO Mock Prefix Code', error);
      },
    );
  }

  companyPrefixField(event: any) {
    let inputValue = event.target.value.toUpperCase();
    let formattedValue = inputValue.replace(/[^A-Z-]/g, '');

    if (!/^[A-Z]/.test(formattedValue)) {
      formattedValue = formattedValue.replace(/[^A-Z]/g, '');
    }

    formattedValue = formattedValue.replace(/-/g, '').substring(0, 3);

    if (inputValue.endsWith('-') && formattedValue.length > 0) {
      formattedValue += '-';
    }

    if (this.initialFirstCustomValue === formattedValue) {
      this.isPrefixChanged = false;
    } else {
      this.isPrefixChanged = true;
    }

    if (this.POPrefixData) {
      this.POPrefixData.firstCustomValue = formattedValue;

      // console.log("this.POPrefixData.firstCustomValue:", this.POPrefixData.firstCustomValue);
    }

    event.target.value = formattedValue;
  }

  toggleTransType(){
    if(this.POPrefixData){
      this.POPrefixData.transactionType = !this.POPrefixData.transactionType;

      if(this.POPrefixData.transactionType){
        this.toastService.showSuccess('Transaction Type Added Successfully');
      }else{
        this.toastService.showSuccess('Transaction Type Removed Successfully');
      }

      if(this.initialTransTypeStatus === this.POPrefixData.transactionType){
        this.isPrefixChanged = false;
      }else{
        this.isPrefixChanged = true;
      }

    }
  }

  toggleBranch() {
    if (this.POPrefixData) {
      this.POPrefixData.branch = !this.POPrefixData.branch;

      if (this.POPrefixData.branch) {
        this.toastService.showSuccess('Branch Added Successfully');
      } else {
        this.toastService.showSuccess('Branch Removed Successfully');
      }

      if (this.initialBranchStatus === this.POPrefixData.branch) {
        this.isPrefixChanged = false;
      } else {
        this.isPrefixChanged = true;
      }
    }
  }

  toggleDept() {
    if (this.POPrefixData) {
      this.POPrefixData.dept = !this.POPrefixData.dept;

      if (this.POPrefixData.dept) {
        this.toastService.showSuccess('Department Added Successfully');
      } else {
        this.toastService.showSuccess('Department Removed Successfully');
      }

      if (this.initailDeptStatus === this.POPrefixData.dept) {
        this.isPrefixChanged = false;
      } else {
        this.isPrefixChanged = true;
      }
    }
  }

  confirmFYRequest() {
    this.isWarningFYPrefixPO = true;
  }

  confirmFYSwitch() {
    this.isWarningFYPrefixPO = false;
    
    this.branchService.updateFinancialYear().subscribe(
      (res: any) => {
        console.log("successfully updated financial year:", res);

        this.toastService.showSuccess(res.error);

        this.onTabSelect(this.selectedTab);
      },
      (error) => {
        console.log("error while updating financial year:", error);
      }
    )
  }

  formatFYInput(event: any) {
    let inputValue = event.target.value.replace(/^FY|-|[^0-9]/g, '');
    let formattedValue = inputValue.substring(0, 6);

    if (event.target.value.endsWith('-') && formattedValue.length === 6) {
      formattedValue += '-';
    }

    if (this.initialLastCustomValue === formattedValue) {
      this.isPrefixChanged = false;
    } else {
      this.isPrefixChanged = true;
    }

    if (this.POPrefixData) {
      this.POPrefixData.lastCustomValue = formattedValue;
    }

    if (formattedValue.length === 6) {
      this.isPrefixChanged = true;
    } else if (formattedValue.length < 6) {
      this.isPrefixChanged = false;
    }

    event.target.value = formattedValue;
  }

  indentLastField(event: any) {
    let inputValue = event.target.value.toUpperCase();

    let formattedValue = inputValue.replace(/[^A-Z0-9-]/g, '');

    let hyphenIndex = formattedValue.indexOf('-');
    if (hyphenIndex !== -1) {
      if (hyphenIndex !== 0 && hyphenIndex !== formattedValue.length - 1) {
        formattedValue = formattedValue.replace(/-/g, '');
      } else {
        formattedValue =
          formattedValue.substring(0, hyphenIndex + 1) +
          formattedValue.substring(hyphenIndex + 1).replace(/-/g, '');
      }
    }

    if (formattedValue.startsWith('-')) {
      if (formattedValue.length > 1) {
        formattedValue = '-';
      }
    } else {
      formattedValue = formattedValue.replace(/-(?=.*[A-Z0-9])/, '');
    }

    formattedValue = formattedValue.substring(0, 5);

    if (this.initialLastCustomValue === formattedValue) {
      this.isPrefixChanged = false;
    } else {
      this.isPrefixChanged = true;
    }

    if (this.POPrefixData && this.POPrefixData.id === 1) {
      this.POPrefixData.lastCustomValue = formattedValue;
    }

    event.target.value = formattedValue;
  }

  confirmPOPrefixCode() {
    const payload = {
      id: this.POPrefixData?.id,
      firstCustomValue: this.POPrefixData?.firstCustomValue,
      branch: this.POPrefixData?.branch,
      dept: this.POPrefixData?.dept,
      lastCustomValue: this.POPrefixData?.lastCustomValue,
      transactionType: this.POPrefixData?.transactionType
    };

    console.log('payload:', payload);

    this.requestService.updatePOPrefixCode(payload).subscribe(
      (res: any) => {
        console.log('successfully updated the PO Prefix code:', res);

        this.toastService.showSuccess(res.error);
      },
      (error) => {
        console.log('error while updating PO Prefix Code', error);
      },
    );
  }

  closepop(closeIcon: boolean) {
    this.isWarningFYPrefixPO = closeIcon;
  }

  closePrefix() {
    this.close.emit(true);
  }
}
