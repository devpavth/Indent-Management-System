import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickoutsideDropdown]',
})
export class ClickoutsideDropdownDirective {
  @Output() clickOutside = new EventEmitter<void>();

  closeDropdownTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      !(event.target as HTMLElement).closest('.dropdown-container') &&
      !(event.target as HTMLElement).closest('.dropdown-button')
    ) {
      this.clickOutside.emit();
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: Event){
    if(!this.closeDropdownTimeout){
      this.closeDropdownTimeout = setTimeout(() => {
        this.clickOutside.emit();
        this.closeDropdownTimeout = null;
      }, 300);
    }
  }

  @HostListener('document:mouseenter', ['$event'])
  onMouseEnter(){
    if(this.closeDropdownTimeout){
      clearTimeout(this.closeDropdownTimeout);
      this.closeDropdownTimeout = null;
    }
  }
}
