import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-success-pop',
  templateUrl: './success-pop.component.html',
  styleUrl: './success-pop.component.css',
})
export class SuccessPopComponent {
  @Output() close = new EventEmitter<boolean>();

  ngOnInit(){

  }

  onClose() {
    // Perform any necessary cleanup or reset logic
    this.refreshComponentState();
    window.location.reload();
  }
  
  refreshComponentState() {
    // Add logic to reset the component
    // For example:
    this.ngOnInit(); // Call ngOnInit again to reinitialize the component
  }
}
