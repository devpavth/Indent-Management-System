import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrl: './view-vendor.component.css',
})
export class ViewVendorComponent {
  isChecked: boolean = false;
  @Output() closeVendor = new EventEmitter<boolean>();
  @Input() vendorData: any;
  isSave = false;
  isEdit = true;
  isSaveIcon = true;
  deleteVendor: any;
  isDelete: boolean = false;
  UpdateVendorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private route: Router,
  ) {
    this.UpdateVendorForm = this.fb.group({
      vendorId: [],
      vendorName: [],
      vdrAdd1: [],
      vdrAdd2: [],
      vdrCity: [],
      vdrState: [],
      vdrCountry: [],
      vdrPincode: [],
      vdrContactPersonName: [],
      vdrContactPersonPhone: [],
      vdrEmail: [],
      vdrGstNo: [],
      vdrPanNo: [],
      vdrTanNo: [],
      vdrMsmeNo: [],
      estDate: [],
      serviceLocation: [],
      bizType: [],
      bizDetailName: [],
      bizDetails: [],
      ifsCode: [],
      bankAccNo: [],
    });
  }

  ngOnInit(): void {
    this.UpdateVendorForm.patchValue(this.vendorData);
    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      this.UpdateVendorForm.get(form)?.disable();
    });
  }
  edit() {
    Object.keys(this.UpdateVendorForm.controls).forEach((form) => {
      this.UpdateVendorForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;
  }
  updateVendorDetails(data: any) {
    console.log(data);
    let id = this.UpdateVendorForm.get('vendorId')?.value;
    console.log(id);

    this.vendorService.updateVendor(id, data).subscribe((res) => {
      console.log(res);
    });
  }

  toggledelete(check: any, isView: boolean) {
    if (check == 1) {
      this.isDelete = isView;
      this.deleteVendor = {
        title: 'Vendor',
        action: 3,
        deleteId: this.vendorData.vendorId,
      };
    } else if (check == 0) {
      this.isDelete = isView;
      this.closeVendor.emit(false);
    }
  }
}
