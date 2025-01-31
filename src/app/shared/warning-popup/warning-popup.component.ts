import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrl: './warning-popup.component.css'
})
export class WarningPopupComponent {
  @Output() close = new EventEmitter<boolean>();
}
