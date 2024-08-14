import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent {
  @ViewChild('firstOtp') firstOtp!: ElementRef;
  @ViewChild('secondOtp') secondOtp!: ElementRef;
  @ViewChild('thirdOtp') thirdOtp!: ElementRef;
  @ViewChild('fourthOtp') fourthOtp!: ElementRef;
  @ViewChild('fifthOtp') fifthOtp!: ElementRef;
  @ViewChild('sixthOtp') sixthOtp!: ElementRef;
  email: any;
  remainingTime: number = 60; // Countdown time in seconds
  timeoutId: any;
  isOtpDisabled: boolean = false;
  companydata: any;
  message: string = '';
  errorMessage: string = '';
  isButtonDisabled: boolean = false;
  LoginsuccessToster: boolean = false;
  otp = {
    first: '',
    second: '',
    third: '',
    fourth: '',
    fifth: '',
    sixth: '',
  };

  constructor(private route: Router) {}
  ngOnInit() {
    this.startCountdown();
    this.email = sessionStorage.getItem('email');
  }
  startCountdown() {
    this.isOtpDisabled = false;
    this.remainingTime = 100;
    this.countdown();
  }
  countdown() {
    if (this.remainingTime > 0) {
      this.timeoutId = setTimeout(() => {
        this.remainingTime--;
        this.countdown();
      }, 1000);
    } else {
      this.isOtpDisabled = true;
    }
  }
  get formattedTime() {
    const minutes: number = Math.floor(this.remainingTime / 60);
    const seconds: number = this.remainingTime % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  resendOTP() {}

  // name change pannatha pakka sonnala apovea
  onSubmit() {
    this.isButtonDisabled = true;
    const otpValue = Object.values(this.otp).join('');
    console.log(otpValue);
    let email = { emailId: this.email };
  }
  ngAfterViewInit() {
    this.firstOtp.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) =>
        this.handleBackspace(event, null, this.firstOtp),
    );
    this.secondOtp.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) =>
        this.handleBackspace(event, this.firstOtp, this.secondOtp),
    );
    this.thirdOtp.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) =>
        this.handleBackspace(event, this.secondOtp, this.thirdOtp),
    );
    this.fourthOtp.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) =>
        this.handleBackspace(event, this.thirdOtp, this.fourthOtp),
    );
    this.fifthOtp.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) =>
        this.handleBackspace(event, this.fourthOtp, this.fifthOtp),
    );
    this.sixthOtp.nativeElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) =>
        this.handleBackspace(event, this.fifthOtp, this.sixthOtp),
    );
  }

  handleBackspace(
    event: KeyboardEvent,
    prevField: ElementRef | null,
    currentField: ElementRef,
  ) {
    if (event.key === 'Backspace' && currentField.nativeElement.value === '') {
      if (prevField) {
        prevField.nativeElement.focus();
        prevField.nativeElement.value = '';
        event.preventDefault();
      }
    }
  }

  moveFocus(event: any, nextField: string) {
    if (event.target.value.length === 1) {
      switch (nextField) {
        case 'second':
          this.secondOtp.nativeElement.focus();
          break;
        case 'third':
          this.thirdOtp.nativeElement.focus();
          break;
        case 'fourth':
          this.fourthOtp.nativeElement.focus();
          break;
        case 'fifth':
          this.fifthOtp.nativeElement.focus();
          break;
        case 'sixth':
          this.sixthOtp.nativeElement.focus();
          break;
        default:
          break;
      }
    }
  }
}
