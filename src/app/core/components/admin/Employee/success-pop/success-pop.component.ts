import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-success-pop-employee',
  templateUrl: './success-pop.component.html',
  styleUrl: './success-pop.component.css',
})
export class SuccessPopComponent {
  @Output() closeSuccessPop = new EventEmitter<boolean>();
  @Input() message: string | undefined;
}
