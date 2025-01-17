import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../service/vendor/vendor.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent implements OnInit {
  _vendor: any;
  vendorData: any;
  Spinner: boolean = true;

  isVendorList: Boolean = false;
  constructor(private vendorService: VendorService) {}
  ngOnInit() {
    this.fetchallvendor();
  }

  fetchallvendor() {
    this.vendorService.getAllVendor().subscribe(
      (res) => {
        this._vendor = res;
        this.Spinner = false;
        console.log(res);
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
  toggleView(action: Boolean, check: number, vendorData: any) {
    if (check == 1) {
      this.isVendorList = action;
      this.vendorData = vendorData;
    }
    if (check == 0) {
      this.isVendorList = action;
      this.fetchallvendor();
    }
  }
}
