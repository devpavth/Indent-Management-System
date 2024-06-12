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
  isVendorView: boolean = false;
  constructor(private vendorService: VendorService) {}
  ngOnInit() {
    this.fetchallvendor();
  }

  fetchallvendor() {
    this.vendorService.getAllVendor().subscribe(
      (res) => {
        this._vendor = res;
        console.log(res);
      },
      (error) => {
        console.log(error);
      },
    );
  }
  viewVendor(data: any) {
    console.log(data);
    this.vendorData = data;
    this.isVendorView = true;
  }
  closeview(data: any) {
    this.isVendorView = data;
    this.fetchallvendor();
  }
}
