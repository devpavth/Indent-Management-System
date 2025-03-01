import { Component, inject } from '@angular/core';
import { BranchService } from '../../service/Branch/branch.service';
import { Branch } from '../../../models/branch/branch.model';
import { RequestService } from '../../service/Request/request.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-indentreports',
  templateUrl: './indentreports.component.html',
  styleUrl: './indentreports.component.css',
})
export class IndentreportsComponent {
  branchService = inject(BranchService);
  requestService = inject(RequestService);
  sanitizer = inject(DomSanitizer);

  branchList: Branch[] = [];
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedBranchId: number = 0;
  selectedReportId: number = 0;
  pdfURL: SafeResourceUrl | null = null;
  isLoading: boolean = false;
  isErrorToast: boolean = false;
  errorToastMsg: string = '';

  indentReportList: { reportId: number; reportName: string }[] = [
    {
      reportId: 1,
      reportName: 'All Indent',
    },
    {
      reportId: 2,
      reportName: 'Urgent Indent',
    },
    {
      reportId: 3,
      reportName: 'Normal Indent',
    },
    {
      reportId: 4,
      reportName: 'Completed Indent',
    },
    {
      reportId: 5,
      reportName: 'Rejected Indent',
    },
  ];

  ngOnInit() {
    this.fetchAllBranch();
  }

  fetchAllBranch() {
    this.branchService.getBranch().subscribe(
      (res: Branch[]) => {
        console.log('fetching branch in indent report:', res);
        this.branchList = res;
        this.branchList.unshift({
          branchId: 0,
          branchName: 'All',
          branchCode: '',
        });
        console.log('this.branchList:', this.branchList);
      },
      (error) => {
        console.log('error fetching branch in indent report:', error);
      },
    );
  }

  selectedReport(event: Event) {
    const selectReportElement = event.target as HTMLSelectElement;
    this.selectedReportId = Number(selectReportElement.value);

    console.log('this.selectedReportId:', this.selectedReportId);
  }

  selectedBranch(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedBranchId = Number(selectElement.value);

    console.log('this.selectedBranchId:', this.selectedBranchId);
  }

  // generateIndentReport(
  //   startDate: Date | undefined,
  //   endDate: Date | undefined,
  // ) {
  //   if(this.selectedReportId === 1){
  //     this.isLoading = true;
  //     this.requestService.fetchDateWiseAllIndentReport(startDate, endDate).subscribe(
  //       (res: Blob) => {
  //         const blob = new Blob([res], {type: 'application/pdf'});
  //         const objectUrl = window.URL.createObjectURL(blob);
  //         this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
  //         console.log("fetching date wise indent report:", res);
  //         this.isLoading= false;
  //       },
  //       (error) => {
  //         console.log("error while fetching date wise report:", error);
  //         this.isLoading = false;
  //       }
  //     )
  //   }else if(this.selectedReportId === 2){
  //     this.isLoading = true;
  //     this.requestService.fetchUrgentIndentReport(startDate, endDate).subscribe(
  //       (res: Blob) => {
  //         const blob = new Blob([res], {type: 'application/pdf'});
  //         const objectUrl = window.URL.createObjectURL(blob);
  //         this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
  //         console.log("fetching urgent indent report:", res);
  //         this.isLoading = false;
  //       },
  //       (error) =>{
  //         console.log("error while fetching urgent indent report:", error);
  //         this.isLoading = false;
  //       }
  //     )

  //   }else if(this.selectedReportId === 3){
  //     this.isLoading = true;
  //     this.requestService.fetchNormalIndentReport(startDate, endDate).subscribe(
  //       (res: Blob) => {
  //         const blob = new Blob([res], { type: 'application/pdf' });
  //         const objectUrl = window.URL.createObjectURL(blob);
  //         this.pdfURL =
  //           this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
  //         console.log('fetching noraml indent report:', res);
  //         this.isLoading = false;
  //       },
  //       (error) => {
  //         console.log('error while fetching normal indent report:', error);
  //         this.isLoading = false;
  //       },
  //     );
  //   }
  // }

  generateIndentReport(startDate: Date | undefined, endDate: Date | undefined) {
    this.isLoading = true;

    const reportApiMap: {
      [key: number]: (
        startDate: Date | undefined,
        endDate: Date | undefined,
      ) => Observable<Blob>;
    } = {
      1: this.requestService.fetchDateWiseAllIndentReport.bind(this.requestService),
      2: this.requestService.fetchUrgentIndentReport.bind(this.requestService),
      3: this.requestService.fetchNormalIndentReport.bind(this.requestService),
      4: this.requestService.fetchCompletedIndentReport.bind(this.requestService),
      5: this.requestService.fetchRejectedIndentReport.bind(this.requestService),
    }

    const fetchReport = reportApiMap[this.selectedReportId];

    if(fetchReport){
      fetchReport(startDate, endDate).subscribe(
        (res: Blob) => {
          const blob = new Blob([res], {type: 'application/pdf'});
          const objectUrl = window.URL.createObjectURL(blob);
          this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          console.log(
            `Fetching report for Report ID: ${this.selectedReportId}`,
            res,
          );
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;

          if (error.error instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const errorMessage = JSON.parse(reader.result as string);
                console.error('Backend Error:', errorMessage);
                this.pdfURL = null;
                this.isErrorToast = true;
                this.errorToastMsg = errorMessage.errorMessege;
                setTimeout(() => {
                  this.isErrorToast = false;
                }, 3000);
              } catch (e) {
                console.error('Failed to parse error response:', e);
              }
            };
            reader.readAsText(error.error);
          } else {
            console.error('Error while fetching report:', error);
          }

        }
      )
    }else{
      console.log('Invalid Report ID:', this.selectedReportId);
      this.isLoading = false;
    }
   
  }
}
