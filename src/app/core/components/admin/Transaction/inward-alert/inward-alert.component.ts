import { Component, inject } from '@angular/core';
import { VendorService } from '../../../service/vendor/vendor.service';
import { ProductService } from '../../../service/Product/product.service';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';

@Component({
  selector: 'app-inward-alert',
  templateUrl: './inward-alert.component.html',
  styleUrl: './inward-alert.component.css'
})
export class InwardAlertComponent {

   _inwardForBranch: any;
  transactionData: any;
  Spinner: boolean = true;

  user: any; 
  userData: any;
  branchId: any;
  branchName: any;

  isTransactionList: Boolean = false;

  productService = inject(ProductService);
  userDetailService = inject(EmployeeServiceService);

  constructor(private vendorService: VendorService) {}
  ngOnInit() {
    console.log("checking inward alert");

    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.userDetailService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log("this.userData:", this.userData);
        console.log("this.userData with branchId:", this.userData.branchId);
        this.branchId = this.userData.branchId;

        if (this.branchId) {
          this.fetchallinwardForBranch();
        } else {
          console.error("branchId is undefined!");
        }


        // sessionStorage.setItem('branchId', this.userData.branchCode);
      });
    }

    // this.fetchallinwardForBranch();
  }

  fetchallinwardForBranch() {
    this.productService.fetchInwardForBranch(this.branchId).subscribe(
      (res: any) => {
        this._inwardForBranch = res;
        this.Spinner = false;
        console.log("fetching inward transaction for branch:",res);
        console.log("fetching inward transaction for branch:",res?.[0]?.fromBranch?.branchName);
        console.log("fetching inward transaction for branch with barnch name:", this._inwardForBranch?.[0]?.fromBranch?.branchName);
        this.branchName = this._inwardForBranch?.[0]?.fromBranch?.branchName;
      },
      (error) => {
        console.log(error);
        this.Spinner = false;
        // if(error.status === 404){
        //   alert("No Vendor Data");
        // }
      },
    );
  }
  toggleView(action: Boolean, check: number, transactionData: any) {
    if (check == 1) {
      this.isTransactionList = action;
      this.transactionData = transactionData;
    }
    if (check == 0) {
      this.isTransactionList = action;
      this.fetchallinwardForBranch();
    }
  }
}
