import { Component } from '@angular/core';

@Component({
  selector: 'app-success-toast',
  templateUrl: './success-toast.component.html',
  styleUrl: './success-toast.component.css',
})
export class SuccessToastComponent {
  visiable = true;

  toggle() {
    this.visiable = !this.visiable;
  }
}
