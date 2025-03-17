import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  isWarningToast: boolean = false;
  warningToastMsg: string = '';

  isErrorToast: boolean = false;
  errorToastMsg: string = '';

  isSuccessToast: boolean = false;
  successToastMsg: string = '';

  constructor() {}

  showWarning(message: string){
    this.isWarningToast = true;
    this.warningToastMsg = message;

    setTimeout(() => {
      this.isWarningToast = false;
    }, 3000);
  }

  showError(message: string){
    this.isErrorToast = true;
    this.errorToastMsg = message;

    setTimeout(() => {
      this.isErrorToast = false;
    }, 3000);
  }

  showSuccess(message: string){
    this.isSuccessToast = true;
    this.successToastMsg = message;

    setTimeout(() => {
      this.isSuccessToast = false;
    }, 3000);
  }
}
