import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFirstCapLetter]',
})
export class FirstCapLetterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const value = inputElement.value;
    inputElement.value = this.capitalizeFirstLetter(value);
  }

  private capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
