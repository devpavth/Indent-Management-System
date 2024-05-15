import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-success-pop',
  templateUrl: './success-pop.component.html',
  styleUrl: './success-pop.component.css',
})
export class SuccessPopComponent {
  @Output() closeSuccessPop = new EventEmitter<boolean>();
}
