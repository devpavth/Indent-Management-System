import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';
import { EmployeeServiceService } from '../../../service/Employee/employee-service.service';

@Component({
  selector: 'app-t-product',
  templateUrl: './t-product.component.html',
  styleUrl: './t-product.component.css',
})
export class TProductComponent implements OnInit {
  transactionData: any;
  vendor: any;
  inwardPrdDetails: any;

  user:any;
  userData: any;
  isAddTransactionView: boolean = false;

  private employeeService = inject(EmployeeServiceService);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.employeeService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log("this.userData:", this.userData);
        console.log("this.userData with empRole:", this.userData.empDesig);

        if(this.userData.empDesig === 15 || this.userData.empDesig === 11){
          console.log("checking..")
          this.isAddTransactionView = true;
        }

        // sessionStorage.setItem('branchId', this.userData.branchCode);
      });
    }
  }

  fetchTransaction(id: any) {
    console.log(id);

    this.productService.productTransaction(id).subscribe((res: any) => {
      console.log(res);
      this.transactionData = res;
      const { transPrdDetails } = res;

      this.inwardPrdDetails = transPrdDetails;
    });
  }
}
