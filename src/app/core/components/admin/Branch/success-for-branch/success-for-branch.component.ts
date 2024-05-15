import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-success-for-branch',
  templateUrl: './success-for-branch.component.html',
  styleUrl: './success-for-branch.component.css',
})
export class SuccessForBranchComponent {
  @Output() closeSuccessPop = new EventEmitter<boolean>();
}
