import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-warning-roleassigning-popup',
  templateUrl: './warning-roleassigning-popup.component.html',
  styleUrl: './warning-roleassigning-popup.component.css',
})
export class WarningRoleassigningPopupComponent {
  @Input() message!: string;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  saveAssigningRole() {
    // this.assigningRole.emit();
    // this.close.emit(false);
  }

  closePopup() {
    // this.close.emit(false);
  }
}
