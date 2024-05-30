import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../service/Request/request.service';
import { DonarService } from '../../service/Donar/donar.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-requistion',
  templateUrl: './view-requistion.component.html',
  styleUrls: ['./view-requistion.component.css'],
})
export class ViewRequistionComponent implements OnInit {
  @Input() reqId: any;
  @Output() closeView = new EventEmitter<boolean>();

  _requestDetails: any = {};
  productData: any;
  donorTotal: number = 0;

  isRejected: boolean = true;
  showDropdown = false;
  invalidDonor = false;
  isApprovelAmt: boolean = false;
  isEditProduct: boolean = false;
  isAction: boolean = true;
  isAccept: boolean = false;

  donorList: any;
  filteredDonors: any[] = [];
  assignedDonors: any[] = [];

  form: FormGroup;
  selectedDonorName = '';

  approvelAmt: number | undefined;

  constructor(
    private requestService: RequestService,
    private donorService: DonarService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      donotedAmt: [''],
      donorId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchDetails(this.reqId);
    this.fetchDonorList();
  }

  fetchDetails(data: any) {
    this.requestService.viewReq(data).subscribe((res) => {
      this._requestDetails = res;
    });
  }

  fetchDonorList() {
    this.donorService.getAllDonor().subscribe((res) => {
      this.donorList = res;
      console.log(res);
      this.filteredDonors = this.donorList;
    });
  }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDonors = this.donorList.filter((donor: any) =>
      `${donor.dfirstName} ${donor.dlastName}`.toLowerCase().includes(input),
    );
    this.showDropdown = true;
  }

  selectDonor(donor: any): void {
    this.selectedDonorName = `${donor.dfirstName} ${donor.dlastName}`;
    this.form.controls['donorId'].setValue(this.selectedDonorName); // Update this line to set the name
    this.invalidDonor = false;
    this.showDropdown = false;
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onSubmit(): void {
    const donorName = this.selectedDonorName; // Change this line to use selectedDonorName
    const selectedDonor = this.donorList.find(
      (donor: any) => `${donor.dfirstName} ${donor.dlastName}` === donorName,
    );

    if (!selectedDonor) {
      this.invalidDonor = true;
    } else {
      this.invalidDonor = false;

      const existingDonorIndex = this.assignedDonors.findIndex(
        (donor: any) => donor.donorId === selectedDonor.donorId,
      );

      if (existingDonorIndex !== -1) {
        this.assignedDonors[existingDonorIndex].donotedAmt +=
          this.form.value.donotedAmt;
        this.donorTotal += this.form.value.donotedAmt;
      } else {
        let list = {
          ...this.form.value,
          donorId: selectedDonor.donorId,
          dfirstName: selectedDonor.dfirstName,
          dlastName: selectedDonor.dlastName,
        };
        this.assignedDonors.push(list);
        this.donorTotal += list.donotedAmt;
      }

      console.log(this.donorTotal);
      console.log('Form submitted', this.assignedDonors);
      this.form.reset();
      this.selectedDonorName = '';
    }
  }

  deleteDonor(data: any) {
    this.assignedDonors.splice(0, 1);
    this.donorTotal -= data;
  }

  closeEdite(data: boolean) {
    this.isEditProduct = data;
    this.fetchDetails(this.reqId);
  }
  productEdit(data: any) {
    this.isEditProduct = true;
    console.log(data);
    let finalProduct = {
      requestId: this._requestDetails.sno,
      total: this._requestDetails.totalPrice,
      ...data,
    };

    this.productData = finalProduct;
  }
}
