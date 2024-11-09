import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warning-toast',
  templateUrl: './warning.component.html',
  styleUrl: './warning.component.css'
})
export class WarningComponent {
  @Input() message: string | undefined;
}
