import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cdelete-pop',
  templateUrl: './cdelete-pop.component.html',
  styleUrl: './cdelete-pop.component.css',
})
export class CdeletePopComponent {
  @Output() close = new EventEmitter<boolean>();
}
