import { Component, EventEmitter, Input, output, Output } from '@angular/core';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrl: './warning-popup.component.css',
})
export class WarningPopupComponent {
  @Input() popupMsg!: string;
  @Input() showWarningIcon!: boolean;
  @Output() close = new EventEmitter<boolean>();
  @Output() clearQuotation = new EventEmitter<void>();

  clearPreviousQuotation() {
    this.clearQuotation.emit();
    this.close.emit(false);
  }

  closePopup() {
    this.close.emit(false);
  }
}
