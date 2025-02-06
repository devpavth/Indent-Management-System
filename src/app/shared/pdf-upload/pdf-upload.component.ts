import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequestService } from '../../core/components/service/Request/request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { ProductService } from '../../core/components/service/Product/product.service';
import { Vendor } from '../../core/models/vendor/vendor.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcurementQuotedataService } from '../../core/components/service/procurementQuotedata/procurement-quotedata.service';
import { indentProductList, ProRequestdata } from '../../core/models/proRequestData/pro-requestdata.model';

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
  ven1Price: number[] = [];
  ven2Price: number[] = [];
  ven3Price: number[] = [];
  leastPrice: number = 0;
  selectedQuote: number | null = null; // Variable for the selected quote index

  assignedVendor: FormGroup;

  noVendor: boolean = false;
  isVendorSelected: boolean = false;
  storeVendorList: Vendor[] = [];

  selectedVendorName: { name: string; isViewCloseIcon: boolean }[] = [];
  isEnableUploadBtn: boolean = false;
  isEnableSearch: boolean = false;
  isToast: boolean = false;
  warningToastMsg: string = '';
  // isViewCloseIcon: boolean = false;
  requestData: ProRequestdata | null = null;
  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];
  filterProductHeadData: indentProductList[] = [];
  // productHeadData: { headOfAccName: string; headOfAccId: number }[] = [];

  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  proQuoteService = inject(ProcurementQuotedataService);

  reqId: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private request: RequestService,
    private fb: FormBuilder,
  ) {
    this.assignedVendor = this.fb.group({
      vendorId: [],
    });
  }

  ngOnInit() {
    this.assignedVendor
      .get('vendorId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          console.log(`vendor Name Changed for Index:`, searchTerm);
          if (this.isVendorSelected) {
            this.isVendorSelected = false;
            return of([]);
          }
          this.noVendor = false;
          this.storeVendorList = [];
          if (
            !searchTerm?.trim() ||
            !isNaN(searchTerm) ||
            searchTerm.length < 3
          ) {
            return of([]);
          }
          return this.productService
            .fetchLiveVendorDetails({ searchTerm })
            .pipe(
              catchError((error) => {
                if (error.status === 404) {
                  console.log('error while fetching vendor data:', error);
                  this.noVendor = true;
                }
                return of([]);
              }),
            );
        }),
      )
      .subscribe((response: Vendor[]) => {
        this.storeVendorList = response;
        console.log('fetching vendor data from backend:', response);

        this.isVendorSelected = false;
      });

    this.requestData = this.proQuoteService.getData();
    if (this.requestData) {
      console.log('Received reqId:', this.requestData.reqId);
      console.log('Received Request No:', this.requestData.requestNo);
      console.log('Received productDetails:', this.requestData.productDetails);
      this.productHeadData = this.requestData.productDetails.map((p) => ({
        headOfAccName: p.headOfAccName,
        headOfAccId: p.headOfAccId,
        id: p.id,
        itemTotalPrice: p.itemTotalPrice,
        prdCode: p.prdCode,
        prdDescription: p.prdDescription,
        prdGstPct: p.prdGstPct,
        prdHsnCode: p.prdHsnCode,
        prdStatus: p.prdStatus,
        prdUnit: p.prdUnit,
        prdbrndName: p.prdbrndName,
        prdcatgName: p.prdcatgName,
        prdgrpName: p.prdgrpName,
        prdmdlName: p.prdmdlName,
        productId: p.productId,
        qty: p.qty,
        unitPrice: p.unitPrice,
      }));
      // console.log(headOfAccName);
    } else {
      console.log('No data found. Handle accordingly.');
    }
    console.log('this.requestData:', this.requestData);
    console.log('this.productHeadData:', this.productHeadData);

    this.uniqueProductHeadData = [
      ...new Map(
        this.productHeadData.map((item) => [item.headOfAccName, item]),
      ).values(),
    ];

    console.log('this.uniqueProductHeadData:', this.uniqueProductHeadData);
  }

  onSelectedVendor(vendor: Vendor) {
    console.log('onSelectedVendor:', vendor);

    this.isVendorSelected = true;

    const vendorExists = this.selectedVendorName.some(
      (v) => v.name === vendor.vendorName,
    );
    if (vendorExists) {
      this.isToast = true;
      this.warningToastMsg = 'Selected Vendor already exists';
      this.storeVendorList = [];
      setTimeout(() => {
        this.isToast = false;
      }, 3000);

      return;
    }

    if (this.selectedVendorName.length < 3) {
      this.selectedVendorName.push({
        name: vendor.vendorName,
        isViewCloseIcon: true,
      });
      this.isEnableUploadBtn = true;
      this.isEnableSearch = false;
    }

    this.storeVendorList = [];
  }

  selectedHeadOfAcc(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const headOfAccId = Number(selectElement.value);
    console.log('headOfAccId:', headOfAccId);
    this.filterProductHeadData = this.productHeadData.filter(
      (pro: indentProductList) => {
        return pro.headOfAccId === headOfAccId;
      },
    );
    this.isEnableSearch = true;
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    console.log('Selected Files:', files);
    console.log('Current pdfFiles:', this.pdfFiles);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('Processing File:', file);

      console.log(
        'this.pdfFiles.some(f => f.name === file.name)',
        this.pdfFiles.some(
          (f) => f.name.trim().toLowerCase() === file.name.trim().toLowerCase(),
        ),
      );

      const isFileAlreadyUploaded = this.pdfFiles.some(
        (f) => f.name === file.name,
      );
      console.log('Is file already uploaded:', isFileAlreadyUploaded);

      if (this.pdfFiles.some((f) => f.name === file.name)) {
        console.log(
          'this.pdfFiles.some(f => f.name === file.name)',
          this.pdfFiles.some((f) => f.name === file.name),
        );
        this.isToast = true;
        this.warningToastMsg =
          'System Detected the Selected PDF is already Uploaded';
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        return;
      }

      if (file) {
        const url = URL.createObjectURL(file);
        this.pdfSrc.push(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        this.pdfFiles.push(file); // Store the File object

        console.log('Updated pdfFiles:', this.pdfFiles);

        this.isEnableUploadBtn = false;
        this.isEnableSearch = true;

        const vendorToDisableCloseIcon = this.selectedVendorName.find(
          (v) => v.isViewCloseIcon,
        );
        console.log('vendorToDisableCloseIcon:', vendorToDisableCloseIcon);
        if (vendorToDisableCloseIcon) {
          vendorToDisableCloseIcon.isViewCloseIcon = false;
        }
      }
    }
  }

  // showPreviousSlide(): void {
  //   if (this.currentSlideIndex > 0) {
  //     this.currentSlideIndex--;
  //   }
  //   console.log(this.pdfSrc);
  // }

  // showNextSlide(): void {
  //   if (this.currentSlideIndex < this.pdfSrc.length - 1) {
  //     this.currentSlideIndex++;
  //   }
  // }

  removeVendor(vendorIndex: number) {
    this.selectedVendorName.splice(vendorIndex, 1);
    this.isEnableSearch = true;
    this.isEnableUploadBtn = false;
  }

  deleteSlide(index: number): void {
    console.log('index:', index);
    this.pdfSrc.splice(index, 1);
    this.pdfFiles.splice(index, 1);

    if (this.selectedVendorName && this.selectedVendorName.length > index) {
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

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.request.uploadPdf(formData, leastPricedFileName).subscribe(
      (response) => {
        console.log('Upload successful', response);
      },
      (error) => {
        console.error('Upload failed', error);
      },
    );
  }

  calculateVen1Price(index: number) {
    // this.ven1Price = this.ven1Price[index];
    console.log('ven 1 index:', index);
    this.quotes[index] = this.ven1Price[index] || 0;

    this.quotes[index] = this.ven1Price.reduce((sum, value) => sum + (value || 0), 0);
  }

  calculateVen2Price(index: number) {
    console.log('ven 2 index:', index);
    this.quotes[index] = this.ven2Price[index] || 0;
    this.quotes[index] = this.ven2Price.reduce((sum, value) =>sum + (value || 0), 0);
  }

  calculateVen3Price(index: number){
    console.log('ven 3 index:', index);
    this.quotes[index] = this.ven3Price[index] || 0;
    this.quotes[index] = this.ven3Price.reduce(
      (sum, value) => sum + (value || 0),
      0,
    );
  }

  updateLeastPrice(): void {
    this.leastPrice = Math.min(
      ...this.quotes.filter((q) => q !== null && q !== undefined),
    );
  }
}
