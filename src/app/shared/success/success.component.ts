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
    } else if (this.successData.show == 3) {
      this.show = 3;
      this.message = this.successData.text;
    } else if (this.successData.show == 4) {
      this.show = 4;
      this.message = this.successData.text;
    } else if (this.successData.show == 5) {
      this.show = 5;
      this.message = this.successData.text;
    }
  }
}
