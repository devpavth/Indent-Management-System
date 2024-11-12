import { Component, Input, SimpleChanges } from '@angular/core';
import { RequestService } from '../../core/components/service/Request/request.service';

@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrl: './confirm-otp.component.css'
})
export class ConfirmOtpComponent {
  @Input() number: string | undefined;
  isSendOtp: boolean = false;
  branchConfirmationOtp: any;
 
  constructor(private requestService: RequestService){
    
  }

  ngOnInit() {
    console.log("ngOnInit - Received number:", this.number);  
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges - Received number:", changes['number'].currentValue); 
  }

  fetchConfirmationOtp(){
    console.log('Fetching OTP...');
    this.requestService.getConfirmOtp().subscribe((res)=>{
      this.branchConfirmationOtp = res;
      this.isSendOtp = true;
      console.log("confirmation otp:",res);
      console.log('API response:', res);
      console.log('isSendOtp:', this.isSendOtp); 
    },(error)=>{
      if (error.status == 503) {
        this.isSendOtp = true;
        console.log('isSendOtp:', this.isSendOtp);
        console.error("Error fetching branch OTP:", error);
      }
    })
  }

  // sendOtp(){
  //   this.isSendOtp = true;
  // }
}
