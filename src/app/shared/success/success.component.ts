import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent implements OnInit {
  show: any;
  message: string = '';
  @Input() successData: any;
  @Output() closeSuccess = new EventEmitter<boolean>();
  ngOnInit(): void {
    if (this.successData.show == 1) {
    } else if (this.successData.show == 2) {
      this.show = 2;
      this.message = this.successData.text;
    }
  }
}
