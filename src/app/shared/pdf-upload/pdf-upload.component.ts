import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css'],
})
export class PdfUploadComponent {
  pdfSrc: SafeResourceUrl[] = [];
  currentSlideIndex: number = 0;

  constructor(private sanitizer: DomSanitizer) {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const url = URL.createObjectURL(file);
        this.pdfSrc.push(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      }
    }
  }

  showPreviousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
    console.log(this.pdfSrc);
  }

  showNextSlide(): void {
    if (this.currentSlideIndex < this.pdfSrc.length - 1) {
      this.currentSlideIndex++;
    }
  }

  deleteSlide(index: number): void {
    this.pdfSrc.splice(index, 1);
    if (this.currentSlideIndex >= this.pdfSrc.length) {
      this.currentSlideIndex = this.pdfSrc.length - 1;
    }
  }
}
