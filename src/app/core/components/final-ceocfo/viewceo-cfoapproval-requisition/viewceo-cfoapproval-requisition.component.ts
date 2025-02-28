import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequestService } from '../../service/Request/request.service';
import { indentProductList } from '../../../models/proRequestData/pro-requestdata.model';
import { EmployeeServiceService } from '../../service/Employee/employee-service.service';
import { Employeedetails } from '../../../models/employee/employeedetails.model';

@Component({
  selector: 'app-viewceo-cfoapproval-requisition',
  templateUrl: './viewceo-cfoapproval-requisition.component.html',
  styleUrl: './viewceo-cfoapproval-requisition.component.css',
})
export class ViewceoCfoapprovalRequisitionComponent {
  @Input() reqId: number = 0;
  @Input() indentNumber: string = '';
  @Input() isCompleted!: boolean;
  @Output() closeView = new EventEmitter<boolean>();

  requestService = inject(RequestService);
  sanitizer = inject(DomSanitizer);
  empService = inject(EmployeeServiceService);

  _requestDetails = signal<any>(null);
  isLoading: boolean = false;
  pdfURL: SafeResourceUrl | null = null;
  selectedHeadOfAccId: number | null = null;
  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];
  userId: string | null = '';
  employeeDetails: Employeedetails | undefined;
  specialRoleId: number = 0;
  isViewAcceptBtn: boolean = false;
  isApproved: boolean = false;
  signUploaded!: boolean;

  ngOnInit() {
    console.log('isCompleted:', this.isCompleted);
    // if(this.isCompleted){
    //   console.log('this.isViewAcceptBtn before:', this.isViewAcceptBtn);
    //   this.isViewAcceptBtn = false;
    //   console.log('this.isViewAcceptBtn after:', this.isViewAcceptBtn);
    // }

    this.fetchDetails(this.reqId);

    this.userId = sessionStorage.getItem('userId');

    this.empService.getEmployeeDetails(this.userId).subscribe(
      (res: Employeedetails) => {
        console.log('fetching employee details:', res);
        this.employeeDetails = res;

        this.specialRoleId = this.employeeDetails.specialRoleId;
        this.signUploaded = this.employeeDetails.signUploaded;
        console.log('this.signUploaded:', this.signUploaded);
      },
      (error) => {
        console.log('error while fetching employee details:', error);
      },
    );
  }

  fetchDetails(reqId: number) {
    this.requestService.viewReq(reqId).subscribe(
      (res) => {
        console.log('fetching indent request details:', res);
        this._requestDetails.set(res);
        this.productHeadData = this._requestDetails()?.productDetails;

        this.uniqueProductHeadData = [
          ...new Map(
            this.productHeadData.map((item) => [item.headOfAccName, item]),
          ).values(),
        ];

        this.uniqueProductHeadData.unshift({
          headOfAccId: 0,
          headOfAccName: 'All',
          id: 0,
          itemTotalPrice: 0,
          prdCode: '',
          prdDescription: '',
          prdGstPct: 0,
          prdHsnCode: 0,
          prdStatus: 0,
          prdUnit: 0,
          prdbrndName: '',
          prdcatgName: '',
          prdgrpName: '',
          prdmdlName: '',
          productId: 0,
          qty: 0,
          unitPrice: 0,
        });

        console.log(
          'this.uniqueProductHeadData after all:',
          this.uniqueProductHeadData,
        );

        if (this.uniqueProductHeadData.length > 0) {
          this.selectedHeadOfAccId = this.uniqueProductHeadData[0].headOfAccId;
          this.selectedHeadOfAcc(this.selectedHeadOfAccId);
        }
      },
      (error) => {
        console.log('error while fetching indent request details:', error);
      },
    );
  }

  selectedHeadOfAcc(event: Event | number) {
    if (typeof event === 'number') {
      this.selectedHeadOfAccId = event;
    } else {
      const selectElement = event.target as HTMLSelectElement;
      this.selectedHeadOfAccId = Number(selectElement.value);
    }

    this.isViewAcceptBtn = this.selectedHeadOfAccId === 0;

    if (this.selectedHeadOfAccId || this.selectedHeadOfAccId === 0) {
      this.fetchQuote(this.selectedHeadOfAccId);
    }
  }

  fetchQuote(headOfAccId: number) {
    this.isLoading = true;

    this.requestService
      .fetchQuoteComparisonPDF(this.reqId, headOfAccId)
      .subscribe(
        (res: Blob) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const objectUrl = window.URL.createObjectURL(blob);

          this.pdfURL =
            this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          this.isLoading = false;
        },
        (error) => {
          console.log('error while fetching comparison quote pdf', error);
          this.isLoading = false;
        },
      );
  }

  acceptSpecialApproval() {
    const requestBody = [{ sno: this.reqId }];
    this.requestService
      .acceptSpecialRoleRequest(this.specialRoleId, requestBody)
      .subscribe(
        (res) => {
          console.log('successfully special role accepted request:', res);
          this.isApproved = true;
        },
        (error) => {
          console.log('error while accepting special role request:', error);
        },
      );
  }

  closepop(closeIcon: boolean) {
    this.isApproved = closeIcon;
  }
}
