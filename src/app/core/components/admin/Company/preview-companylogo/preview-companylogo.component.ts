import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-preview-companylogo',
  templateUrl: './preview-companylogo.component.html',
  styleUrl: './preview-companylogo.component.css',
})
export class PreviewCompanylogoComponent {
  companyLogo: string | null = '';
  @Output() close = new EventEmitter<boolean>();

  ngOnInit() {
    this.companyLogo = sessionStorage.getItem('companyLogo');
  }

  onClose(){
    this.close.emit(true);
  }
}
