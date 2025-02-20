import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../service/Product/product.service';
import { BranchService } from '../../service/Branch/branch.service';
import { Branch } from '../../../models/branch/branch.model';

@Component({
  selector: 'app-stockreport-branch',
  templateUrl: './stockreport-branch.component.html',
  styleUrl: './stockreport-branch.component.css',
})
export class StockreportBranchComponent {
  dateRange: FormGroup;

  productService = inject(ProductService);
  branchService = inject(BranchService);
  branchList: Branch[] = [];

  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedBranchId: number = 0;

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
    this.fetchAllBranch();
  }

  fetchAllBranch(){
    this.branchService.getBranch().subscribe(
      (res: Branch[]) => {
        console.log("fetching branch Details:", res);
        this.branchList = res;
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

    this.productService.fetchStockReportForBranch(this.selectedBranchId, startDate, endDate).subscribe(
      (res) => {
        console.log("fetching normal request", res);
      },(error) =>{
        console.log("error while fetching request:", error);
      }
    )

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
  setBrowserUrl(): void {
    const url =
      'http://192.168.1.11:9004/product/stockreport?startDate=2024-07-17&endDate=2024-07-24';
    window.open(url, '_blank');
  }
}
