import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
  private readonly MAX_VALUE = 1_000_000_000_000;
  private readonly MAX_LENGTH = 13; // Maximum length of digits for 1 trillion

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.includes('-')) {
      inputElement.value = inputElement.value.replace('-', '');
    }
    this.checkMaxValue(inputElement);
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
    } else {
      setTimeout(() => {
        const inputElement = this.el.nativeElement as HTMLInputElement;
        this.checkMaxValue(inputElement);
      }, 0);
    }
  }

  private checkMaxValue(inputElement: HTMLInputElement): void {
    let value = inputElement.value;

    // Remove leading zeros
    value = value.replace(/^0+/, '');

    // Ensure the value doesn't exceed the max length
    if (value.length > this.MAX_LENGTH) {
      value = value.slice(0, this.MAX_LENGTH);
    }

    const numericValue = parseInt(value, 10);
    if (numericValue > this.MAX_VALUE) {
      inputElement.value = this.MAX_VALUE.toString();
    } else {
      inputElement.value = value;
    }
  }
}
