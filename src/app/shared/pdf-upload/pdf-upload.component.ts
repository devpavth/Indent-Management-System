import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequestService } from '../../core/components/service/Request/request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { ProductService } from '../../core/components/service/Product/product.service';
import { Vendor } from '../../core/models/vendor/vendor.type';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css'],
})
export class PdfUploadComponent {
  pdfSrc: SafeResourceUrl[] = [];
  pdfFiles: File[] = []; // Array to hold the File objects
  currentSlideIndex: number = 0;

  quotes: number[] = [0, 0, 0]; // Array for the quotes
  leastPrice: number = 0;
  selectedQuote: number | null = null; // Variable for the selected quote index

  assignedVendor: FormGroup;

  noVendor: boolean = false;
  isVendorSelected: boolean = false;
  storeVendorList: Vendor[] = [];

  selectedVendorName: string[] = [];

  productService = inject(ProductService)

  constructor(
    private sanitizer: DomSanitizer,
    private request: RequestService,
    private fb: FormBuilder
  ) {
    this.assignedVendor = this.fb.group({
      vendorId: [],
    })
  }

  ngOnInit(){
    this.assignedVendor.get('vendorId')?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((searchTerm) => {
        console.log(`vendor Name Changed for Index:`, searchTerm);
        if(this.isVendorSelected){
          this.isVendorSelected = false;
          return of([]);
        }
        this.noVendor = false;
        this.storeVendorList = [];
        if(!searchTerm?.trim() || !isNaN(searchTerm) || searchTerm.length < 3){
          return of([]);
        }
        return this.productService.fetchLiveVendorDetails({searchTerm}).pipe(
          catchError((error) => {
            if(error.status === 404){
              console.log("error while fetching vendor data:", error);
              this.noVendor = true;
            }
            return of([]);
          })
        )
      })
    ).subscribe(
      (response: Vendor[]) => {
        this.storeVendorList = response;
        console.log("fetching vendor data from backend:", response);

        this.isVendorSelected = false;
      }
    )
  }

  onSelectedVendor(vendor: Vendor){
    console.log("onSelectedVendor:", vendor);

    this.isVendorSelected = true;

    if(this.selectedVendorName.length< 3 && !this.selectedVendorName.includes(vendor.vendorName)){
      this.selectedVendorName.push(vendor.vendorName);
    }

    this.storeVendorList = [];
  }
  

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);

      if (file) {
        const url = URL.createObjectURL(file);
        this.pdfSrc.push(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        this.pdfFiles.push(file); // Store the File object
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
    console.log("index:", index);
    this.pdfSrc.splice(index, 1);
    this.pdfFiles.splice(index, 1);

    if(this.selectedVendorName && this.selectedVendorName.length > index){
      this.selectedVendorName.splice(index, 1);
    }
    if (this.currentSlideIndex >= this.pdfSrc.length) {
      this.currentSlideIndex = this.pdfSrc.length - 1;
    }
  }

  uploadPdf(): void {
    if (this.pdfFiles.length === 0) {
      console.error('No PDF files to upload');
      return;
    }

    const leastPriceIndex = this.quotes.indexOf(this.leastPrice);
    if (leastPriceIndex === -1) {
      console.error('No valid least price found');
      return;
    }

    const leastPricedFileName = this.pdfFiles[leastPriceIndex].name;

    const formData = new FormData();
    console.log(this.pdfFiles);
    console.log(leastPricedFileName);

    this.pdfFiles.forEach((file) => {
      formData.append('files', file, file.name);
    });

    // Append the least priced file name separately
    formData.append('leastPricedFileName', leastPricedFileName);

    this.request.uploadPdf(formData, leastPricedFileName).subscribe(
      (response) => {
        console.log('Upload successful', response);
      },
      (error) => {
        console.error('Upload failed', error);
      },
    );
  }

  updateLeastPrice(): void {
    this.leastPrice = Math.min(
      ...this.quotes.filter((q) => q !== null && q !== undefined),
    );
  }
}
