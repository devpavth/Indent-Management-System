import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../../service/Request/request.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-add-mode-of-payment',
  templateUrl: './add-mode-of-payment.component.html',
  styleUrl: './add-mode-of-payment.component.css',
})
export class AddModeOfPaymentComponent {
  @Input() initialModeOfPayment!: string;
  @Input() modeOfPaymentId!: number;
  @Output() closeAddMOPModal = new EventEmitter<boolean>();

  isEnableSubmitBtn: boolean = false;

  requestService = inject(RequestService);
  router = inject(Router);
  toastService = inject(ToastService);

  addModeOfPaymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addModeOfPaymentForm = this.fb.group({
      modeOfPayment: [, [Validators.required, Validators.maxLength(80)]],
    });
  }

  ngOnInit(){
    console.log('initialModeOfPayment:', this.initialModeOfPayment);
    if (this.initialModeOfPayment) {
      this.addModeOfPaymentForm.patchValue({
        modeOfPayment: this.initialModeOfPayment,
      });
    }   
  }

  checkModeOfPayment(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue !== this.initialModeOfPayment) {
      console.log("condition false");
      this.isEnableSubmitBtn = true;
    } else {
      this.isEnableSubmitBtn = false;
    }
  }

  submitModeOfPayment(formValue: any) {
    console.log('formValue:', formValue);
    if(!this.initialModeOfPayment && !this.modeOfPaymentId){
      this.requestService.createModeOfPayment(formValue).subscribe(
        (res: any) => {
          console.log('successfully added mode of payment:', res);
          this.toastService.showSuccess(res.errorMessege);
          setTimeout(() => {
            this.router.navigate(['/home/modeOfPayment']);
          }, 2000);
        },
        (error) => {
          console.log('error while adding mode of payment:', error);
        },
      );
    }
    
    if(this.initialModeOfPayment && this.modeOfPaymentId){
      this.requestService
        .updateModeOfPayment(this.modeOfPaymentId, formValue)
        .subscribe(
          (res: any) => {
          console.log("updating mode of payment:", res);
          this.toastService.showSuccess(res.errorMessege);
          setTimeout(() => {
            this.router.navigate(['/home/modeOfPayment']);
          }, 2000);
        },
        (error) => {
          console.log("error while updating mode of payment:", error);
        }
      );
    }
  }
}
