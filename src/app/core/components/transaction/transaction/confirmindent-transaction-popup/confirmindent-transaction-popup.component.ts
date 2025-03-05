import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmindent-transaction-popup',
  templateUrl: './confirmindent-transaction-popup.component.html',
  styleUrl: './confirmindent-transaction-popup.component.css',
})
export class ConfirmindentTransactionPopupComponent {
  @Input() confirmTransactionMsg: string = '';
  @Output() close = new EventEmitter<boolean>();
  @Output() confirmIndentTrans = new EventEmitter<boolean>();

  route = inject(Router);

  closePopup() {
    this.close.emit();
  }

  confirmIndentTransaction(){
    this.confirmIndentTrans.emit();
    this.close.emit(false);
  }

  onClose() {
    this.route.navigate(['/home/pTransaction']);
  }
}
