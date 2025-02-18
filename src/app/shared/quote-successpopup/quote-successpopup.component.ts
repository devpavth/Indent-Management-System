import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-successpopup',
  templateUrl: './quote-successpopup.component.html',
  styleUrl: './quote-successpopup.component.css',
})
export class QuoteSuccesspopupComponent {
  @Input() quotedHeadOfAccName: string = '';
  @Output() close = new EventEmitter<boolean>();

  route = inject(Router);

  ngOnInit() {}

  onClose() {
    this.close.emit(false);
    // this.refreshComponentState();
    // window.location.reload();
  }

  // refreshComponentState() {
  //   // Add logic to reset the component
  //   // For example:
  //   this.ngOnInit();
  // }
}
