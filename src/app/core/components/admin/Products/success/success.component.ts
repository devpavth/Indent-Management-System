import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  @Output() saveSuccess = new EventEmitter<boolean>();
}
