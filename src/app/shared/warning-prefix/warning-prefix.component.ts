import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-warning-prefix',
  templateUrl: './warning-prefix.component.html',
  styleUrl: './warning-prefix.component.css',
})
export class WarningPrefixComponent {
  @Output() close = new EventEmitter<boolean>();
  @Output() confirmFYSwitch = new EventEmitter<void>();

  confirmFYChange(){
    this.close.emit(false);
    this.confirmFYSwitch.emit();
  }
}
