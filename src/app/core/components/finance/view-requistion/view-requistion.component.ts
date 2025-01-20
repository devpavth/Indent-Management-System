import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../service/Request/request.service';

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
import { FunderService } from '../../service/Funder/funder.service';

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
  commendArray: { key: string; value: string }[] = [];

  constructor(
    private requestService: RequestService,
    private donorService: FunderService,
    private shared: SharedServiceService,
    private fb: FormBuilder,
    private loc: Location,
  ) {
    this.form = this.fb.group({
      donotedAmt: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
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
      console.log("fetching data:", res);
      this._requestDetails.set(res);
      this.calculateDate();
    });
  }
  openInNewTab() {
    const url = this.loc.prepareExternalUrl('/home/addDonar');
    window.open(url, '_blank');
  }
  fetchDonorList(data: any) {
    this.donorService.funderList().subscribe((res) => {
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
        (fin) => fin.funderCatgName == 'Local',
      );
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    } else if (data == 3) {
      this.donorList = this.cList.filter((fin) => fin.funderCatgName == 'FCRA');
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    } else if (data == 4) {
      this.donorList = this.cList.filter(
        (fin) => fin.funderCatgName == 'Donor',
      );
      this.filteredDonors = this.donorList;
      console.log(this.donorList);
    }
  }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDonors = this.donorList.filter((donor: any) =>
      `${donor.funderName}`.toLowerCase().includes(input),
    );
    this.showDropdown = true;
  }

  selectDonor(donor: any): void {
    this.selectedDonorName = `${donor.funderName} `;
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

  // onSubmit(): void {
  //   const donorName = this.selectedDonorName; // Change this line to use selectedDonorName
  //   const selectedDonor = this.donorList.find(
  //     (donor: any) => `${donor.dfirstName} ${donor.dlastName}` === donorName,
  //   );

  //   if (!selectedDonor) {
  //     this.invalidDonor = true;
  //   } else {
  //     this.invalidDonor = false;

  //     const existingDonorIndex = this.assignedDonors.findIndex(
  //       (donor: any) => donor.donorId === selectedDonor.donorId,
  //     );

  //     if (existingDonorIndex !== -1) {
  //       this.assignedDonors[existingDonorIndex].donotedAmt +=
  //         this.form.value.donotedAmt;
  //       this.donorTotal += this.form.value.donotedAmt;
  //     } else {
  //       let list = {
  //         ...this.form.value,
  //         donorId: selectedDonor.donorId,
  //         dfirstName: selectedDonor.dfirstName,
  //         dlastName: selectedDonor.dlastName,
  //       };
  //       this.assignedDonors.push(list);

  //       this.donorTotal += list.donotedAmt;
  //     }

  //     console.log(this.donorTotal);
  //     console.log('Form submitted', this.assignedDonors);
  //     this.form.reset();
  //     this.selectedDonorName = '';
  //   }
  // }
  calculateDonorTotal(donors: any[]): number {
    return donors.reduce((total, donor) => total + donor.donotedAmt, 0);
  }
  onSubmit(): void {
    const donorName = this.selectedDonorName; // Use selectedDonorName
    const selectedDonor = this.donorList.find(
      (donor: any) => `${donor.funderName} ` === donorName,
    );

    if (!selectedDonor) {
      this.invalidDonor = true;
    } else {
      this.invalidDonor = false;

      const existingDonorIndex = this.assignedDonors.findIndex(
        (donor: any) => donor.funderId === selectedDonor.funderId,
      );

      const donotedAmt = Number(this.form.value.donotedAmt); // Ensure donotedAmt is a number

      if (existingDonorIndex !== -1) {
        this.assignedDonors[existingDonorIndex].donotedAmt += donotedAmt;
      } else {
        let list = {
          ...this.form.value,
          donotedAmt: donotedAmt, // Ensure donotedAmt is a number
          funderId: selectedDonor.funderId,
          funderName: selectedDonor.funderName,
        };
        this.assignedDonors.push(list);
      }

      this.donorTotal = this.calculateDonorTotal(this.assignedDonors);

      console.log(this.donorTotal);
      console.log('Form submitted', this.assignedDonors);
      this.form.reset();
      this.selectedDonorName = '';
    }
  }

  deleteDonor(data: any) {
    this.assignedDonors.splice(0, 1);
    this.donorTotal = this.calculateDonorTotal(this.assignedDonors);
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
        funderId: fin.funderId,
        contribAmt: fin.donotedAmt,
      })),
    };
    this.requestService.finDonorAssign(this.reqId, finalList).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error(error);

        if (error.status) {
          alert('Successfully Registered');
        }
      },
    );
  }
  fetchReason() {
    this.requestService.commands().subscribe((res) => {
      // this.commend = res;
      // console.log("this.commend:", this.commend);
      this.commendArray = Object.entries(res).map(([key, value]) =>({
        key,
        value,
      }))
      .filter((item) => item.key !== '0');
      console.log("this.commend:", this.commendArray);
    });
  }
  postReason(data: any) {
    console.log("reason for holding or rejection:", data);
    console.log("typeof reason for holding or rejection:", typeof data);

    const numericData = Number(data);
    console.log("Converted numeric data:", numericData);
    console.log("typeof Converted numeric data:", typeof numericData);

    if (this.isHolding == true && this.isReject == false) {
      this.requestService.commend(this.reqId, numericData, 1)?.subscribe(
        (res) => {
          console.log("successfully hold the request:", res);
        },
        (error) => {
          console.log("error while holding the request:", error);
          if (error.status == 200) {
            alert('This Request is on Hold');
            this.closeView.emit(false);
          }
        },
      );
    }
    if (this.isHolding == false && this.isReject == true) {
      this.requestService.commend(this.reqId, numericData, 2)?.subscribe(
        (res) => {
          console.log("successfully rejected the request:", res);
        },
        (error) => {
          console.log("error while rejecting the request:", error);
          if (error.status == 200) {
            alert('This Request is Rejected');
            this.closeView.emit(false);
          }
        },
      );
    }
  }
  calculateDate() {
    const check = new Date(this._requestDetails().indentHeaders.requiredDate);
    let date = check.getTime() / 1000;
    console.log(date);

    this.caldate = this.shared.calculateDateDifference(date);
    console.log(this.caldate);
  }
}
