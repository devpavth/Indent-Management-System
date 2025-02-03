import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-fundbranchreason',
  templateUrl: './view-fundbranchreason.component.html',
  styleUrl: './view-fundbranchreason.component.css'
})
export class ViewFundbranchreasonComponent {
  @Input() checkedFund: any;
  @Output() close = new EventEmitter<boolean>();

  selectedReason: (string | number) | undefined;

  closePopUp(){
    this.close.emit(true);
  }
}
