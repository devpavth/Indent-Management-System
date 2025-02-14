import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-successpopup',
  templateUrl: './quote-successpopup.component.html',
  styleUrl: './quote-successpopup.component.css',
})
export class QuoteSuccesspopupComponent {
  @Input() quotedHeadOfAccName: string = '';
  @Input() quoteMsg: string = '';
  @Output() close = new EventEmitter<boolean>();

  route = inject(Router);

  ngOnInit() {}

  onClose() {
    if (this.quotedHeadOfAccName) {
      this.close.emit(false);
    }else if (this.quoteMsg) {
      this.route.navigate(['/home/proReqList']);
    }
    // this.refreshComponentState();
    // window.location.reload();
  }

  // refreshComponentState() {
  //   // Add logic to reset the component
  //   // For example:
  //   this.ngOnInit();
  // }
}
