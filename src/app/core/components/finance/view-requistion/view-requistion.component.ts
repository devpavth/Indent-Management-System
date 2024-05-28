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
  _requestDetails: any;
  isRejected: boolean = true;
  donorList: any;
  filteredDonors: any[] = [];
  showDropdown = false;
  form: FormGroup;
  selectedDonorName = '';
  invalidDonor = false;
  assignedDonorList: any[] = [];
  approvelAmt: number | undefined;

  isApprovelAmt: boolean = false;

  constructor(
    private requestService: RequestService,
    private donorService: DonarService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      qty: [''],
      donorName: ['', Validators.required],
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
    this.form.controls['donorName'].setValue(donor.donorId);
    this.invalidDonor = false;
    this.showDropdown = false;
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  productEdit(data: any) {
    console.log(data);
  }
  onSubmit(): void {
    const donorName = this.form.controls['donorName'].value;
    const selectedDonor = this.donorList.find(
      (donor: any) => donor.donorId === donorName,
    );

    if (!selectedDonor) {
      this.invalidDonor = true;
    } else {
      this.invalidDonor = false;
      let list = {
        ...this.form.value,
        dfirstName: selectedDonor.dfirstName,
        dlastName: selectedDonor.dlastName,
      };
      this.assignedDonorList.push(list);
      console.log('Form submitted', list);
      this.form.reset();
    }
  }
}
