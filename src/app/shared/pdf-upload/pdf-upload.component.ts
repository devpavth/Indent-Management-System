import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequestService } from '../../core/components/service/Request/request.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import { ProductService } from '../../core/components/service/Product/product.service';
import { Vendor } from '../../core/models/vendor/vendor.type';
import { ActivatedRoute, Router } from '@angular/router';
// import { ProcurementQuotedataService } from '../../core/components/service/procurementQuotedata/procurement-quotedata.service';
import { indentProductList, ProRequestdata } from '../../core/models/proRequestData/pro-requestdata.model';
import { ProcurementQuotedataService } from '../../core/components/service/procurementQuotedata/procurement-quotedata.service';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css'],
})
export class PdfUploadComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchSubject = new Subject<string>();
  pdfSrc: SafeResourceUrl[] = [];
  pdfFiles: File[] = []; // Array to hold the File objects
  currentSlideIndex: number = 0;

  quotes: number[] = [0, 0, 0]; // Array for the quotes
  ven1Price: number[] = [];
  ven2Price: number[] = [];
  ven3Price: number[] = [];
  leastPrice: number = 0;
  leastPricedVendorName: string = '';
  leastPricedVendorId: number = 0;
  qcHeadOfAcc: any[] = [];
  isWarningPopup: boolean = false;
  previousHeadofAccId: number | null = null;
  currentHeadOfAccId: number | null = null;
  selectedQuote: number | null = null; // Variable for the selected quote index

  // assignedVendor: FormGroup;
  comparisonQuoteForm: FormGroup;

  noVendor: boolean = false;
  isVendorSelected: boolean = false;
  storeVendorList: Vendor[] = [];
  selectedVendorId: number = 0;
  currentHeadIndex: number | null = null;

  selectedVendorName: {
    vendorId: number;
    name: string;
    isViewCloseIcon: boolean;
  }[] = [];
  productIds: { productId: number; quotedPrice: number }[] = [];
  isEnableUploadBtn: boolean = false;
  isEnableSearch: boolean = false;
  isToast: boolean = false;
  isSuccessToast: boolean = false;
  warningToastMsg: string = '';
  deleteToastMsg: string = '';
  isQuoteUploaded: boolean = false;
  quotedHeadOfAccName: string = '';
  quoteMsg: string = '';
  filterQuotedHeadOfAcc: indentProductList[]=[];
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
    this.comparisonQuoteForm = this.fb.group({
      indentId: null,
      qcHeadOfAcc: this.fb.array([this.headOfAccDetailsArr()]),
    });
  }

  headOfAccDetailsArr() {
    return this.fb.group({
      headOfAccId: null,
      leastQuotedVendor: null,
      qcVendors: this.fb.array([this.comparisonVendors()]),
    });
  }

  comparisonVendors() {
    return this.fb.group({
      vendorId: null,
      quotePath: [''],
      qcProducts: this.fb.array([this.quotationProductArr()]),
    });
  }

  quotationProductArr() {
    return this.fb.group({
      productId: null,
      quotedPrice: [],
    });
  }

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          if (typeof searchTerm !== 'string') {
            console.error('Invalid search term:', searchTerm);
            return of([]);
          }
          if (this.isVendorSelected) {
            this.isVendorSelected = false;
            return of([]);
          }
          this.noVendor = false;
          this.storeVendorList = [];
          if (
            !searchTerm ||
            !isNaN(Number(searchTerm)) ||
            searchTerm.length < 3
          ) {
            return of([]);
          }
          return this.productService
            .fetchLiveVendorDetails({ searchTerm })
            .pipe(
              catchError((error) => {
                if (error.status === 404) {
                  this.noVendor = true;
                }
                return of([]);
              }),
            );
        }),
      )
      .subscribe((response: Vendor[]) => {
        this.storeVendorList = response;
        this.isVendorSelected = false;
      });

    // this.comparisonQuoteForm
    //   .get('qcHeadOfAcc')
    //   ?.valueChanges.subscribe((qcHeadOfAccArray) => {
    //     qcHeadOfAccArray.forEach((qcHeadGroup: any, headIndex: number) => {
    //       const qcVendorsArray = this.getQcVendorsArray(headIndex);

    //       qcVendorsArray.controls.forEach((vendorGroup, vendorIndex) => {
    //         vendorGroup
    //           .get('vendorId')
    //           ?.valueChanges.pipe(
    //             debounceTime(300),
    //             switchMap((searchTerm) => {
    //               console.log(`vendor Name Changed for Index:`, searchTerm);
    //               if (this.isVendorSelected) {
    //                 this.isVendorSelected = false;
    //                 return of([]);
    //               }
    //               this.noVendor = false;
    //               this.storeVendorList = [];
    //               if (
    //                 !searchTerm ||
    //                 !isNaN(searchTerm) ||
    //                 searchTerm.length < 3
    //               ) {
    //                 return of([]);
    //               }
    //               return this.productService
    //                 .fetchLiveVendorDetails({ searchTerm })
    //                 .pipe(
    //                   catchError((error) => {
    //                     if (error.status === 404) {
    //                       console.log(
    //                         'error while fetching vendor data:',
    //                         error,
    //                       );
    //                       this.noVendor = true;
    //                     }
    //                     return of([]);
    //                   }),
    //                 );
    //             }),
    //           )
    //           .subscribe((response: Vendor[]) => {
    //             this.storeVendorList = response;
    //             console.log('fetching vendor data from backend:', response);

    //             this.isVendorSelected = false;
    //           });
    //       });
    //     });
    //   });

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

    this.isSuccessToast = true;
    this.deleteToastMsg = 'Step 1: Select Head of Account';
    setTimeout(() => {
      this.isSuccessToast = false;
    }, 3000);

    this.verifyQuoteComparisonHeadOfAcc(this.requestData?.reqId);
  }

  verifyQuoteComparisonHeadOfAcc(sno: number | undefined){
    this.request.verifyQuoteComparisonHeadOfAcc(sno).subscribe(
      (res: any) => {
        console.log("verifying quote compare headofacc:", res);
        this.filterQuotedHeadOfAcc = res;
        this.uniqueProductHeadData = this.uniqueProductHeadData.filter((head) => {
          return !this.filterQuotedHeadOfAcc.some((item) => item.headOfAccId === head.headOfAccId);
        });

        console.log(
          'this.uniqueProductHeadData after filter:',
          this.uniqueProductHeadData,
        );

        // if(this.uniqueProductHeadData.length === 0){
        //   this.isQuoteUploaded = true;
        //   this.quoteMsg =
        //     'Quote Comparison done for all Head of Account so the Indent moved to Accepted list.';
        // }
      },(error)=>{
        console.log("error while fetching verified headOfAcc:", error);
      }
    )
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.trim();
    this.searchSubject.next(searchTerm);
  }

  getQcHeadOfAccArray(): FormArray {
    return this.comparisonQuoteForm.get('qcHeadOfAcc') as FormArray;
  }

  getQcVendorsArray(headIndex: number): FormArray {
    return this.getQcHeadOfAccArray()
      .at(headIndex)
      .get('qcVendors') as FormArray;
  }

  onSelectedVendor(vendor: Vendor, headOfAccIndex: number) {
    console.log('onSelectedVendor:', vendor);

    this.isVendorSelected = true;
    this.selectedVendorId = vendor.vendorId;

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
        vendorId: vendor.vendorId,
        name: vendor.vendorName,
        isViewCloseIcon: true,
      });
      this.isEnableUploadBtn = true;
      this.isEnableSearch = false;
      this.isSuccessToast = true;
      this.deleteToastMsg = `Upload ${vendor.vendorName} Quotation`;
      setTimeout(() => {
        this.isSuccessToast = false;
      }, 3000);

      console.log('this.selectedVendorName:', this.selectedVendorName);

      console.log(
        'this.getQcVendorsArray(headOfAccIndex)',
        this.getQcVendorsArray(headOfAccIndex),
      );

      const qcVendorsArray = this.getQcVendorsArray(headOfAccIndex);

      console.log('qcVendorsArray:', qcVendorsArray);

      if (
        qcVendorsArray.length > 0 &&
        qcVendorsArray.at(0).value.vendorId === null
      ) {
        qcVendorsArray.removeAt(0);
      }

      console.log('qcVendorsArray after removal:', qcVendorsArray.value);

      if (qcVendorsArray) {
        // Ensure a new vendor object is created
        const newVendorGroup = this.fb.group({
          vendorId: [vendor.vendorId],
          quotePath: [''], // Add other fields if necessary
          qcProducts: this.fb.array([]), // Initialize an empty array if needed
        });

        // Push the new vendor into the FormArray
        qcVendorsArray.push(newVendorGroup);
        console.log('Updated qcVendorsArray:', qcVendorsArray.value);
      }
    }

    const qcHeadOfAccArray = this.comparisonQuoteForm.get(
      'qcHeadOfAcc',
    ) as FormArray;
    // const qcVendorsArray = qcHeadOfAccArray
    //   .at(headOfAccIndex)
    //   .get('qcVendors') as FormArray;

    this.storeVendorList = [];
  }

  // selectedHeadOfAcc(event: Event) {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const headOfAccId = Number(selectElement.value);
  //   console.log('headOfAccId:', headOfAccId);

  //   if (
  //     this.previousHeadofAccId !== null &&
  //     this.previousHeadofAccId !== headOfAccId
  //   ) {
  //     this.isSuccessToast = false;
  //     this.isWarningPopup = true;
  //     this.currentHeadOfAccId = headOfAccId;
  //   } else {
  //     this.isSuccessToast = true;
  //     this.deleteToastMsg = 'Step 2: Search Vendor Name';
  //     setTimeout(() => {
  //       this.isSuccessToast = false;
  //     }, 3000);
  //   }

  //   this.filterProductHeadData = this.productHeadData.filter(
  //     (pro: indentProductList) => {
  //       return pro.headOfAccId === headOfAccId;
  //     },
  //   );

  //   this.isEnableSearch = true;

  //   if (!headOfAccId) {
  //     this.isSuccessToast = false;
  //     this.isWarningPopup = true;
  //   }

  //   this.previousHeadofAccId = headOfAccId;

  //   // this.filterProductHeadData.length = 0;
  // }

  selectedHeadOfAcc(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const headOfAccId = Number(selectElement.value);

    console.log('Selected headOfAccId:', headOfAccId);

    const selectedHead = this.uniqueProductHeadData.find(
      (h) => h.headOfAccId === headOfAccId,
    );

    this.quotedHeadOfAccName = selectedHead ? selectedHead.headOfAccName : '';
    console.log('this.quotedHeadOfAccName:', this.quotedHeadOfAccName);

    this.comparisonQuoteForm.patchValue({
      qcHeadOfAcc: [
        {
          headOfAccId: headOfAccId,
          leastQuotedVendor: this.leastPricedVendorId,
        },
      ],
    });

    // If the selected headOfAccId is different from the previous one, show the popup
    if (
      this.previousHeadofAccId !== null &&
      this.previousHeadofAccId !== headOfAccId && this.selectedVendorName.length !== 0
    ) {
      this.isWarningPopup = true;
      this.currentHeadOfAccId = headOfAccId; // Store the new selection temporarily
      console.log('this.currentHeadOfAccId:', this.currentHeadOfAccId);
      console.log(
        'this.currentHeadOfAccId of type:',
        typeof this.currentHeadOfAccId,
      );
    } else {
      this.applyHeadOfAccId(headOfAccId);
    }
  }

  // Function to apply the selected Head of Account
  applyHeadOfAccId(headOfAccId: number) {
    this.previousHeadofAccId = headOfAccId; // Update previous selection
    this.isWarningPopup = false; // Hide the popup

    // Apply the filtered product head data
    this.filterProductHeadData = this.productHeadData.filter(
      (pro: indentProductList) => pro.headOfAccId === headOfAccId,
    );

    console.log('this.filterProductHeadData:', this.filterProductHeadData);

    this.productIds = this.filterProductHeadData.map((item) => ({
      productId: item.productId,
      quotedPrice: 0,
    }));
    console.log('productIds:', this.productIds);

    const headIndex = this.comparisonQuoteForm.value.qcHeadOfAcc.findIndex(
      (head: { headOfAccId: number }) => head.headOfAccId === headOfAccId,
    );

    if (headIndex === -1) {
      console.error('headIndex not found for headOfAccId:', headOfAccId);
      return;
    }

    // Reset other data
    this.isSuccessToast = true;
    this.deleteToastMsg = 'Step 2: Search Vendor Name';
    setTimeout(() => {
      this.isSuccessToast = false;
    }, 3000);
    this.isEnableSearch = true;
    this.pdfSrc = [];
    this.selectedVendorName = [];
    this.pdfFiles = [];
  }

  // Function to update `qcProducts` for each vendor
  updateQcProductsForVendors(qcVendorsArray: FormArray) {
    qcVendorsArray.controls.forEach((vendorControl, index) => {
      let qcProductsArray = vendorControl.get('qcProducts') as FormArray;

      if (!qcProductsArray) {
        console.error(`qcProducts FormArray is missing at index ${index}`);
        return;
      }

      // Clear existing products to avoid duplication
      qcProductsArray.clear();

      // Push the stored `productIds` to each vendor
      this.productIds.forEach((product) => {
        qcProductsArray.push(
          new FormGroup({
            productId: new FormControl(product.productId),
            quotedPrice: new FormControl(product.quotedPrice),
          }),
        );
      });

      console.log(
        `Updated qcProducts for vendor ${index}:`,
        qcProductsArray.value,
      );
    });

    console.log('Fully updated qcVendorsArray:', qcVendorsArray.value);
  }

  clearPreviousQuotation() {
    const headOfAccIndex = 0;
    this.pdfSrc = [];
    this.selectedVendorName = [];
    this.pdfFiles = [];
    this.currentHeadOfAccId = null;
    this.previousHeadofAccId = null;
    this.ven1Price = [];
    this.ven2Price = [];
    this.ven3Price = [];
    this.quotes = [];
    console.log(
      'this.getQcVendorsArray(headOfAccIndex) before',
      this.getQcVendorsArray(headOfAccIndex).value,
    );
    const qcVendorsArray = this.getQcVendorsArray(headOfAccIndex);
    qcVendorsArray.clear();
    console.log(
      'this.getQcVendorsArray(headOfAccIndex) after',
      this.getQcVendorsArray(headOfAccIndex).value,
    );
    this.comparisonQuoteForm.reset();
    this.isEnableSearch = false;
    console.log('Previous quotation cleared!');
  }

  clearQuotation(){
    const headOfAccIndex = 0;
    this.pdfSrc = [];
    this.selectedVendorName = [];
    this.pdfFiles = [];
    this.currentHeadOfAccId = null;
    this.previousHeadofAccId = null;
    this.ven1Price = [];
    this.ven2Price = [];
    this.ven3Price = [];
    this.quotes = [];
    console.log(
      'this.getQcVendorsArray(headOfAccIndex) before',
      this.getQcVendorsArray(headOfAccIndex).value,
    );
    const qcVendorsArray = this.getQcVendorsArray(headOfAccIndex);
    qcVendorsArray.clear();
    console.log(
      'this.getQcVendorsArray(headOfAccIndex) after',
      this.getQcVendorsArray(headOfAccIndex).value,
    );
    this.comparisonQuoteForm.reset();
    this.isEnableSearch = false;
    this.isQuoteUploaded = false;
    console.log('Quotation cleared!');
  }

  onFileSelected(event: any, headIndex: number, vendorIndex: number): void {
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

        const qcVendorsArray = this.getQcVendorsArray(headIndex);

        if (qcVendorsArray) {
          qcVendorsArray.controls.forEach((vendorControl, index) => {
            // Assign each vendor a file from pdfFiles array (ensure index is within bounds)
            const fileName = this.pdfFiles[index]?.name || '';

            vendorControl.get('quotePath')?.setValue(fileName);
          });
          console.log('Updated qcVendorsArray:', qcVendorsArray.value);

          this.updateQcProductsForVendors(qcVendorsArray);
        }

        this.isEnableUploadBtn = false;
        this.isEnableSearch = true;

        const vendorToDisableCloseIcon = this.selectedVendorName.find(
          (v) => v.isViewCloseIcon,
        );
        console.log('vendorToDisableCloseIcon:', vendorToDisableCloseIcon);
        if (vendorToDisableCloseIcon) {
          vendorToDisableCloseIcon.isViewCloseIcon = false;
        }

        if (this.selectedVendorName.length < 3) {
          this.isSuccessToast = true;
          this.deleteToastMsg = 'Search Next Vendor Name';
          setTimeout(() => {
            this.isSuccessToast = false;
          }, 3000);
        }

        if (this.selectedVendorName.length === 3) {
          this.isSuccessToast = true;
          this.deleteToastMsg = 'Scroll Down to Comparison Table';
          setTimeout(() => {
            this.isSuccessToast = false;
          }, 3000);
        }
      }
    }
  }

  closepop(data: boolean) {
    this.currentHeadOfAccId = this.previousHeadofAccId;
    this.isWarningPopup = data;
    // this.isQuoteUploaded = data;
  }

  removeVendor(vendorIndex: number) {
    console.log("vendorIndex in removeVendor:", vendorIndex);
    console.log('this.selectedVendorName before:', this.selectedVendorName);
    this.selectedVendorName.splice(vendorIndex, 1);
    console.log("this.selectedVendorName after:", this.selectedVendorName);
    const qcVendorsArray = this.getQcVendorsArray(vendorIndex);
    qcVendorsArray.clear();
    console.log('qcVendorsArray in removing the vendor:', qcVendorsArray.value);
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

  uploadPdf(quoteData: any): void {
    console.log('quoteData:', quoteData);
    this.comparisonQuoteForm.patchValue({
      indentId: this.requestData?.reqId,
    });

    this.comparisonQuoteForm.patchValue({
      qcHeadOfAcc: [
        {
          leastQuotedVendor: this.leastPricedVendorId,
        },
      ],
    });
    console.log('getting comparisonQuoteForm:', this.comparisonQuoteForm.value);
    if (this.pdfFiles.length === 0) {
      console.error('No PDF files to upload');
      return;
    }

    // const leastPriceIndex = this.quotes.indexOf(this.leastPrice);
    // if (leastPriceIndex === -1) {
    //   console.error('No valid least price found');
    //   return;
    // }

    // const leastPricedFileName = this.pdfFiles[leastPriceIndex].name;

    // const formData = new FormData();
    // console.log(this.pdfFiles);
    // console.log(leastPricedFileName);

    // this.pdfFiles.forEach((file) => {
    //   formData.append('files', file, file.name);
    // });

    // // Append the least priced file name separately
    // formData.append('leastPricedFileName', leastPricedFileName);

    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    const pdfFilesArray = Array.from(this.pdfFiles);

    this.request
      .uploadPdf(this.comparisonQuoteForm.value, pdfFilesArray)
      .subscribe(
        (response) => {
          console.log('Upload successful:', response);
          this.verifyQuoteComparisonHeadOfAcc(this.requestData?.reqId);
          if (this.uniqueProductHeadData.length !== 0){
            this.isQuoteUploaded = true;
          }
        },
        (error) => {
          console.log('Upload failed:', error);
        },
      );
  }

  updateVendorPrice(
    index: number,
    vendorIndex: number,
    priceArray: number[],
    quoteIndex: number,
  ) {
    const headOfAccIndex = 0;
    console.log(`Vendor ${vendorIndex + 1} index:`, index);

    priceArray[index] = priceArray[index] || 0;
    console.log(`Price Array for vendor ${vendorIndex + 1}:`, priceArray);

    const qcHeadOfAccArray = this.comparisonQuoteForm.get(
      'qcHeadOfAcc',
    ) as FormArray;

    if (!qcHeadOfAccArray || !qcHeadOfAccArray.at(headOfAccIndex)) {
      console.log('Invalid headOfAccIndex:', headOfAccIndex);
      return;
    }

    const qcVendorsArray = qcHeadOfAccArray
      .at(headOfAccIndex)
      .get('qcVendors') as FormArray;

    if (!qcVendorsArray) {
      console.log('qcVendorsArray is undefined at index', headOfAccIndex);
      return;
    }

    const vendor = qcVendorsArray.at(vendorIndex);

    if (!vendor || !vendor.get('qcProducts')) {
      console.log(`qcProducts is undefined for vendor ${vendorIndex}`);
      return;
    }

    const qcProductsArray = vendor.get('qcProducts') as FormArray;

    if (!qcProductsArray.at(index)) {
      console.log(`qcProductsArray does not have an entry at index ${index}`);
      return;
    }

    qcProductsArray.at(index).patchValue({ quotedPrice: priceArray[index] });

    console.log(
      `Updated qcProductsArray for Vendor ${vendorIndex + 1}:`,
      qcProductsArray.value,
    );

    this.quotes[quoteIndex] = priceArray.reduce(
      (sum, value) => sum + (value || 0),
      0,
    );
    this.updateLeastPrice();
  }

  calculateVen1Price(index: number) {
    this.updateVendorPrice(index, 0, this.ven1Price, 0);
  }

  calculateVen2Price(index: number) {
    this.updateVendorPrice(index, 1, this.ven2Price, 1);
  }

  calculateVen3Price(index: number) {
    this.updateVendorPrice(index, 2, this.ven3Price, 2);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  updateLeastPrice(): void {
    this.leastPrice = Math.min(
      ...this.quotes.filter((q) => q !== null && q !== undefined),
    );

    const leastPriceIndex = this.quotes.indexOf(this.leastPrice);
    if (leastPriceIndex === -1) {
      console.error('No valid least price found');
      return;
    }

    this.leastPricedVendorName = this.selectedVendorName[leastPriceIndex].name;
    console.log('leastPricedVendorName:', this.leastPricedVendorName);

    this.leastPricedVendorId =
      this.selectedVendorName[leastPriceIndex].vendorId;
    console.log('leastPricedVendorId:', this.leastPricedVendorId);
  }
}
