import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonarService } from '../../../service/Donar/donar.service';

@Component({
  selector: 'app-view-donar',
  templateUrl: './view-donar.component.html',
  styleUrl: './view-donar.component.css',
})
export class ViewDonarComponent implements OnInit {
  @Input() donorId: any;
  @Output() closeView = new EventEmitter<boolean>();

  updateDonorForm: FormGroup;
  _donarCategory: any[] = [
    { located: 'Local Donor', value: 125 },
    { located: 'Existing Donor', value: 126 },
    { located: 'International Donor', value: 127 },
  ];

  _donor: any;
  isEdit: boolean = true;
  isSave: boolean = false;
  isDelete: boolean = false;
  isSuccess: boolean = false;
  ngOnInit() {
    this.fetchDonorData();
  }
  constructor(
    private fb: FormBuilder,
    private donorService: DonarService,
  ) {
    this.updateDonorForm = this.fb.group({
      donorId: [],
      dfirstName: ['', [Validators.required]],
      dlastName: ['', [Validators.required]],
      dcontactNumber: ['', [Validators.required]],
      demailId: ['', [Validators.required]],
      dcategory: ['', [Validators.required]],
      daddress1: ['', [Validators.required]],
      daddress2: ['', [Validators.required]],
      dcity: ['', [Validators.required]],
      dcountry: ['', [Validators.required]],
      dstate: ['', [Validators.required]],
      dpinCode: ['', [Validators.required]],
    });
  }
  fetchDonorData() {
    this.isEdit = true;
    this.isSave = false;
    this.donorService.viewDonor(this.donorId).subscribe((res) => {
      this._donor = res;
      this.updateDonorForm.patchValue({
        donorId: this._donor.donorId,
        dfirstName: this._donor.dfirstName,
        dlastName: this._donor.dlastName,
        dcontactNumber: this._donor.dcontactNumber,
        demailId: this._donor.demailId,
        dcategory: this._donor.dcategory,
        daddress1: this._donor.daddress1,
        daddress2: this._donor.daddress2,
        dcity: this._donor.dcity,
        dcountry: this._donor.dcountry,
        dstate: this._donor.dstate,
        dpinCode: this._donor.dpinCode,
      });
      Object.keys(this.updateDonorForm.controls).forEach((controlName) => {
        this.updateDonorForm.get(controlName)?.disable();
      });
    });
  }
  updateDonor(data: any) {
    console.log(data);
    this.donorService.updateDonor(this.donorId, data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this.isSuccess = true;
        }
      },
    );
  }
  edit() {
    this.isEdit = false;
    this.isSave = true;
    Object.keys(this.updateDonorForm.controls).forEach((controlName) => {
      this.updateDonorForm.get(controlName)?.enable();
    });
  }
  deleteDonor() {
    this.donorService.deleteDonor(this.donorId).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        if (error.status == 200) {
          this.closeView.emit(false);
        }
      },
    );
  }
}
