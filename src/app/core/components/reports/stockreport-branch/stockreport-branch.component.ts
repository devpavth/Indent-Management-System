import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { BranchService } from '../../service/Branch/branch.service';
import { Branch } from '../../../models/branch/branch.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-stockreport-branch',
  templateUrl: './stockreport-branch.component.html',
  styleUrl: './stockreport-branch.component.css',
})
export class StockreportBranchComponent {
  dateRange: FormGroup;

  productService = inject(ProductService);
  branchService = inject(BranchService);
  sanitizer = inject(DomSanitizer);
  branchList: Branch[] = [];

  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedBranchId: number = 0;
  pdfUrl: SafeResourceUrl | null = null;
  maxDate: string = '';
  isLoading: boolean = false;

  constructor(private readonly fb: FormBuilder) {
    this.dateRange = this.fb.group({
      from: [],
      to: [],
    });
  }
  ngOnInit() {
    // let data = {
    //   start: '2024-07-17 00:00:00.000000',
    //   end: '2024-07-21 00:00:00.000000',
    // };
    // this.productService.getStockReport(data).subscribe((res: any) => {
    //   console.log(res);
    // });
    console.log('testing stock normal report');
    const today = new Date();
    console.log("today:", today);
    console.log("typeof today:", typeof today);
    this.maxDate = today.toISOString().split('T')[0];
    console.log("maxDate:", this.maxDate);
    // console.log("typeof maxDate:", typeof maxDate);
    this.fetchAllBranch();
  }

  resetEndDate(){
    // this.endDate = '';
  }

  fetchAllBranch(){
    this.branchService.getBranch().subscribe(
      (res: Branch[]) => {
        console.log("fetching branch Details:", res);
        this.branchList = res;
        this.branchList.unshift({branchId: 0, branchName: 'All', branchCode: ''})
        console.log('this.branchList:', this.branchList);
      },
      (error) => {
        console.log("error while fetching branch details:", error);
      }
    )
  }

  selectedBranch(event: Event){
    console.log("event:", event);
    const selectedElement = event.target as HTMLSelectElement;
    this.selectedBranchId = Number(selectedElement.value);

    console.log('this.selectedBranchId:', this.selectedBranchId);
  }

  onSubmit(startDate: Date | undefined, endDate: Date | undefined) {
    console.log('Date choosen', startDate, endDate);

    if(this.selectedBranchId === 0){
      this.isLoading = true;
      this.productService.fetchAllBranchStockReport(startDate, endDate).subscribe(
        (res: Blob) => {
          const blob = new Blob([res], {type: 'application/pdf'});
          const objectUrl = window.URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          console.log('fetching all branch stock report', res);
          this.isLoading = false;
        },(error) =>{
          console.log('error while fetching all branch stock report:', error);
          this.isLoading = false;
        }
      )
    }else{
      this.isLoading = true;
      this.productService.fetchStockReportForBranch(this.selectedBranchId, startDate, endDate).subscribe(
        (res: Blob) => {
          const blob = new Blob([res], {type: 'application/pdf'});
          const objectUrl = window.URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          console.log("fetching normal request", res);
          this.isLoading = false;
        },(error) =>{
          console.log("error while fetching request:", error);
          this.isLoading = false;
        }
      )
    }

    // this.productService.getStockReport(data).subscribe(
    //   (res: any) => {
    //     console.log(res);
    //     console.log('Response body:', res.body);
    //     console.log('Response headers:', res.headers.url);
    //   },
    //   (error) => {
    //     if (error.status == 200) {
    //       console.log(error);

    //       console.log('Response headers:', error.url);
    //       const url = error.url;
    //       window.open(url, '_blank');
    //     }
    //   },
    // );
  }
  // setBrowserUrl(): void {
  //   const url =
  //     'http://192.168.1.11:9004/product/stockreport?startDate=2024-07-17&endDate=2024-07-24';
  //   window.open(url, '_blank');
  // }
}
