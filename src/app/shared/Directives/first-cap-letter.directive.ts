import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFirstCapLetter]',
})
export class FirstCapLetterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    this.capitalizeFirstLetter();
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const capitalizedText = this.capitalizeFirstLetterString(pastedText);
    document.execCommand('insertText', false, capitalizedText);
  }

  private capitalizeFirstLetter(): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const value = inputElement.value;
    inputElement.value = this.capitalizeFirstLetterString(value);
  }

  private capitalizeFirstLetterString(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
