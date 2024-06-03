import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../service/Request/request.service';
import { DonarService } from '../../service/Donar/donar.service';
import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-view-requistion',
  templateUrl: './view-requistion.component.html',
  styleUrls: ['./view-requistion.component.css'],
})
export class ViewRequistionComponent implements OnInit {
  @Input() reqId: any;
  @Output() closeView = new EventEmitter<boolean>();
  dataService = inject(RequestService);

  // _requestDetails: any = {};
  _requestDetails = signal<any>(null);
  productData: any;
  donorTotal: number = 0;
  caldate: any;

  isRejected: boolean = true;
  showDropdown = false;
  invalidDonor = false;
  isApprovelAmt: boolean = false;
  isEditProduct: boolean = false;
  isAction: boolean = true;
  isAccept: boolean = false;
  isHolding: boolean = false;
  isReject: boolean = false;

  reasonHead: string = '';
  commend: any;

  donorList: any;
  dList: any;
  cList: any[] = [];
  filteredDonors: any[] = [];
  assignedDonors: any[] = [];

  form: FormGroup;
  selectedDonorName = '';

  approvelAmt: number | undefined;

  constructor(
    private requestService: RequestService,
    private donorService: DonarService,
    private shared: SharedServiceService,
    private fb: FormBuilder,
    private loc: Location,
  ) {
    this.form = this.fb.group({
      donotedAmt: [''],
      donorId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchDetails(this.reqId);
    this.fetchDonorList(1);
    this.fetchReason();
  }

  fetchDetails(data: any) {
    this.requestService.viewReq(data).subscribe((res) => {
      this._requestDetails.set(res);
      this.calculateDate();
    });
  }
  openInNewTab() {
    const url = this.loc.prepareExternalUrl('/home/addDonar');
    window.open(url, '_blank');
  }
  fetchDonorList(data: any) {
    this.donorService.getAllDonor().subscribe((res) => {
      this.dList = res;
      this.cList = this.dList;
      // this.donorList = res;
      console.log(res);
    });
    if (data == 1) {
      this.donorList = this.cList;
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    } else if (data == 2) {
      this.donorList = this.cList.filter(
        (fin) => fin.dcategoryStatus == 'Local Donor',
      );
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    } else if (data == 3) {
      this.donorList = this.cList.filter(
        (fin) => fin.dcategoryStatus == 'International Donor',
      );
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    } else if (data == 4) {
      this.donorList = this.cList.filter(
        (fin) => fin.dcategoryStatus == 'Existing Donor',
      );
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    }
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

  addApprovalAmt(data: any) {
    this.approvelAmt = Number(data);
    console.log(this.approvelAmt);

    this.isApprovelAmt = true;
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
      requestId: this._requestDetails().sno,
      total: this._requestDetails().totalPrice,
      ...data,
    };

    this.productData = finalProduct;
  }

  submiteDonorList() {
    let finalList = {
      finApprAmount: this.approvelAmt,
      assignedDonors: this.assignedDonors.map((fin) => ({
        donorId: fin.donorId,
        donotedAmt: fin.donotedAmt,
      })),
    };
    this.requestService
      .finDonorAssign(this.reqId, finalList)
      .subscribe((res) => {
        console.log(res);
      });
  }
  fetchReason() {
    this.requestService.commands().subscribe((res) => {
      this.commend = res;
    });
  }
  postReason(data: any) {
    if (this.isHolding == true && this.isReject == false) {
      this.requestService.commend(this.reqId, data, 1)?.subscribe((res) => {
        console.log(res);
      });
    }
    if (this.isHolding == false && this.isReject == true) {
      this.requestService.commend(this.reqId, data, 2)?.subscribe((res) => {
        console.log(res);
      });
    }
  }
  calculateDate() {
    const check = new Date(this._requestDetails().createdOn);
    let date = check.getTime() / 1000;
    console.log(date);

    this.caldate = this.shared.calculateDateDifference(date);
    console.log(this.caldate);
  }
}
