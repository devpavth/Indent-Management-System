import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRequiredField]',
})
export class RequiredFieldDirective {
  @Input() iconPath: string = '../../../../../assets/Img/required.svg';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngControl: NgControl,
  ) {}

  ngAfterViewInit() {
    const control = this.ngControl.control;
    if (control && control.validator) {
      const validatorFn = control.validator({} as any);
      if (validatorFn && validatorFn?.['required']) {
        this.addRequiredIcon();
      }
    }
  }

  private addRequiredIcon() {
    let label = this.el.nativeElement.closest('div')?.querySelector('label');

    if(this.el.nativeElement.type === 'radio'){
      label = this.el.nativeElement.closest('.col-span-8')?.querySelector('label');
    }

    if (label) {
      const icon = this.renderer.createElement('img');
      this.renderer.setAttribute(icon, 'src', this.iconPath);
      this.renderer.setAttribute(icon, 'class', 'h-3.5 w-3.5 mt-[1px]');
      this.renderer.setAttribute(icon, 'alt', 'required');
      this.renderer.appendChild(label, icon);
    }
  }
}
