import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-warning-quotecompare-message',
  templateUrl: './warning-quotecompare-message.component.html',
  styleUrl: './warning-quotecompare-message.component.css',
})
export class WarningQuotecompareMessageComponent {
  @Input() quoteCompareAmtPopUpMsg: string = '';
  @Output() close = new EventEmitter<boolean>();
}
