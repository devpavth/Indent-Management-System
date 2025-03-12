import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-consolidatedquote',
  templateUrl: './view-consolidatedquote.component.html',
  styleUrl: './view-consolidatedquote.component.css',
})
export class ViewConsolidatedquoteComponent {
  @Input() reqId: number = 0;
  @Output() closeView = new EventEmitter<boolean>();

  requestService = inject(RequestService);
  sanitizer = inject(DomSanitizer);

  pdfUrl: SafeResourceUrl | null = null;

  isLoading: boolean = false;

  ngOnInit() {
    console.log('reqId in consolidated component:', this.reqId);

    this.fetchConsolidatedQuotePDF(this.reqId);
  }

  fetchConsolidatedQuotePDF(reqId: number) {
    this.isLoading = true;
    this.requestService.fetchConsolidatedQuotePDF(reqId).subscribe(
      (res: Blob) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const objectUrl = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
        // window.open(this.pdfUrl);
        console.log('Fetching consolidated quote pdf:', res);
        this.isLoading = false;
      },
      (error) => {
        console.log('error while fetching consolidated quote pdf:', error);
        this.isLoading = false;
      },
    );
  }
}
