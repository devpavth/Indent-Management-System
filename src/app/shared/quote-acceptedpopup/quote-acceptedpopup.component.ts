import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-acceptedpopup',
  templateUrl: './quote-acceptedpopup.component.html',
  styleUrl: './quote-acceptedpopup.component.css',
})
export class QuoteAcceptedpopupComponent {
  @Input() quoteMsg: string = '';
  @Output() close = new EventEmitter<boolean>();

  route = inject(Router);

  ngOnInit() {}

  onClose() {
    this.route.navigate(['/home/proReqList']);
  }
}
