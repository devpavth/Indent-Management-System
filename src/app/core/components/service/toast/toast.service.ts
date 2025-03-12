import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  isWarningToast: boolean = false;
  warningToastMsg: string = '';

  constructor() {}

  showWarning(message: string){
    this.isWarningToast = true;
    this.warningToastMsg = message;

    setTimeout(() => {
      this.isWarningToast = false;
    }, 3000);
  }
}
