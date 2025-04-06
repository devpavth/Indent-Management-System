import { Component, inject, Input } from '@angular/core';
import { ToastService } from '../../core/components/service/toast/toast.service';

@Component({
  selector: 'app-warning-toast',
  templateUrl: './warning.component.html',
  styleUrl: './warning.component.css',
})
export class WarningComponent {
  @Input() message: string | undefined;

  toastService = inject(ToastService);

  closeToast(){
    this.toastService.isWarningToast = false;
  }
}
