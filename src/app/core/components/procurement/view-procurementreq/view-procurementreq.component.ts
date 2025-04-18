import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunderService } from '../../service/Funder/funder.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProRequestdata } from '../../../models/proRequestData/pro-requestdata.model';
import { ProcurementQuotedataService } from '../../service/procurementQuotedata/procurement-quotedata.service';

@Component({
  selector: 'app-view-procurementreq',
  templateUrl: './view-procurementreq.component.html',
  styleUrl: './view-procurementreq.component.css',
})
export class ViewProcurementreqComponent {
  @Input() reqId: any;
  @Output() closeView = new EventEmitter<boolean>();
  dataService = inject(RequestService);
  route = inject(Router);
  procurementDataService = inject(ProcurementQuotedataService);

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
  loading: boolean = true;

  reasonHead: string = '';
  commend: any;

  donorList: any;
  dList: any;
  cList: any[] = [];
  filteredDonors: any[] = [];
  assignedDonors: any[] = [];
  assignedFunder: any[] = [];
  assignnewFunder: any[] = [];
  isToast: boolean = false;
  warningToastMsg: any;

  isViewAction: boolean = true;
  isViewAcceptRejectAction: boolean = false;
  isViewFunderTable: boolean = false;
  isViewFinRejIndent: boolean = false;
  isViewFinHoldIndent: boolean = false;

  form: FormGroup;
  selectedDonorName = '';

  isFunderSelected: boolean = false;
  noFunder: boolean = false;
  funderSearchList: any[] = [];
  private originalFunderSearchList: any[] = [];
  selectedFunderId: any;
  isViewFundDetails: boolean = false;
  funderDetails: any[] = [];
  assignedFundId: any[] = [];

  isApproved: boolean = false;
  isRejectPop: boolean = false;
  isWarningPopup: boolean = false;

  companyLogo = sessionStorage.getItem('companyLogo');

  approvelAmt: number | undefined;
  commendArray: { key: string; value: string }[] = [];
  funderId!: number;

  constructor(
    private requestService: RequestService,
    private donorService: FunderService,
    private shared: SharedServiceService,
    private fb: FormBuilder,
    private loc: Location,
  ) {
    this.form = this.fb.group({
      // donotedAmt: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      funderId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.form
      .get('funderId')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          if (this.isFunderSelected) {
            return of([]);
          }
          this.noFunder = false;
          if (!searchTerm || searchTerm.length < 3) {
            this.funderSearchList = [];
            return of([]);
          }
          return this.donorService.funderList({ searchTerm }).pipe(
            catchError((error) => {
              if (error.status === 404) {
                console.log('Funder API Error:', error);
                this.noFunder = true;
              }
              return of([]);
            }),
          );
        }),
      )
      .subscribe((response: any) => {
        console.log('fetching funder data from backend:', response);

        this.funderSearchList = response;
        this.isFunderSelected = false;
      });

    console.log('this.reqId:', this.reqId);

    this.fetchDetails(this.reqId);
    this.fetchReason();
  }

  onAccept() {
    this.isAccept = true;
    this.isAction = false;
    this.isHolding = false;
    this.isReject = false;
    const requestData: ProRequestdata = {
      reqId: this.reqId,
      requestNo: this._requestDetails()?.indentHeaders?.requestNo,
      productDetails: this._requestDetails()?.productDetails,
    };
    console.log('requestData:', requestData);
    this.procurementDataService.setData(requestData);
    this.route.navigate(['home/qComparison']);
  }

  fetchDetails(data: any) {
    this.requestService.viewReq(data).subscribe((res) => {
      console.log('fetching data:', res);
      this._requestDetails.set(res);
      this.loading = false;

      const procurementStatusCode =
        this._requestDetails()?.prctAuthData?.authStatusCode;

      if (procurementStatusCode === 102) {
        this.isViewAction = true;
      }

      if (procurementStatusCode === 202) {
        this.isViewAction = false;
      }

      if (procurementStatusCode === 301) {
        this.isViewAction = false;
      }

      const authStatusCode =
        this._requestDetails()?.financeAuthData?.authStatusCode;
      console.log('Finance Auth Status:', authStatusCode);
      console.log('Finance Auth Status:', typeof authStatusCode);

      if (authStatusCode === 202) {
        // this.isViewAction = true;
        this.assignedFunder = this._requestDetails()?.assignedDonors;
        console.log('this.assignedFunder:', this.assignedFunder);

        if (this.assignedFunder.length > 0) {
          console.log('this.assignedFunder:', this.assignedFunder);
          console.log('Rendering Funder Table...');
          // this.isAccept = true;
          this.isViewFunderTable = true;
          this.isViewFinRejIndent = false;
          this.donorTotal = this.assignedFunder.reduce(
            (total, donor) => total + donor.contribAmt,
            0,
          );
        }
      }

      if (authStatusCode === 406) {
        this.isViewAction = false;
        // this.isAccept = true;
        this.isViewFinRejIndent = true;
      }

      if (authStatusCode === 418) {
        this.isViewAction = true;
        this.isViewAcceptRejectAction = true;
        // this.isAccept = true;
        this.isViewFinHoldIndent = true;
      }

      // this._requestDetails.find((req))
      this.calculateDate();
    });
  }
  openInNewTab() {
    const url = this.loc.prepareExternalUrl('/home/addFunder');
    window.open(url, '_blank');
  }
  // fetchDonorList(data: any) {
  //   console.log("donar data:", data);
  //   this.donorService.funderList().subscribe((res) => {
  //     this.dList = res;
  //     this.cList = this.dList;
  //     // this.donorList = res;
  //     console.log("Funder List:", res);
  //   });
  //   if (data == 1) {
  //     this.donorList = this.cList;
  //     this.filteredDonors = this.donorList;
  //     console.log(this.donorList);
  //   } else if (data == 2) {
  //     this.donorList = this.cList.filter(
  //       (fin) => fin.funderCatgName == 'Local',
  //     );
  //     this.filteredDonors = this.donorList;
  //     console.log(this.donorList);
  //   } else if (data == 3) {
  //     this.donorList = this.cList.filter((fin) => fin.funderCatgName == 'FCRA');
  //     this.filteredDonors = this.donorList;
  //     console.log(this.donorList);
  //   } else if (data == 4) {
  //     this.donorList = this.cList.filter(
  //       (fin) => fin.funderCatgName == 'Donor',
  //     );
  //     this.filteredDonors = this.donorList;
  //     console.log(this.donorList);
  //   }
  // }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDonors = this.donorList?.filter((donor: any) =>
      `${donor.funderName}`.toLowerCase().includes(input),
    );
    this.showDropdown = true;
  }

  selectDonor(donor: any): void {
    console.log('after selecting donor from list', donor);
    this.isFunderSelected = true;
    this.selectedDonorName = `${donor.funderName} `;
    this.form.controls['funderId'].setValue(this.selectedDonorName); // Update this line to set the name
    this.selectedFunderId = donor.funderId;
    console.log('this.selectedFunderId:', this.selectedFunderId);
    this.isViewFundDetails = true;

    const funderExists = this.assignedFunder.some(
      (funder: any) => funder.funderId === donor.funderId,
    );

    if (funderExists) {
      console.log('Funder already exists in assignedFunder, blocking search.');
      this.isViewFundDetails = false;
      this.isToast = true;
      this.warningToastMsg = `${donor.funderName} already exists in Funder cart.`;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
      return;
    }

    this.fetchFunderDetails();
    // this.onSelectedFunder(funderData);
    if (
      !this.originalFunderSearchList ||
      this.originalFunderSearchList.length === 0
    ) {
      this.originalFunderSearchList = [donor]; // Assign array with donor object
    } else {
      this.originalFunderSearchList.push(donor); // Add donor object to existing array
    }

    this.funderSearchList = [];
    // this.invalidDonor = false;
    // this.showDropdown = false;
  }

  fetchFunderDetails() {
    this.requestService.fetchFunderDetails(this.selectedFunderId).subscribe(
      (res: any) => {
        console.log('fetching funder details:', res);
        this.funderDetails = res;
        console.log('this.funderDetails:', this.funderDetails);
      },
      (error) => {
        console.log('error while fetching funder details:', error);
      },
    );
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

  onSelectedFunder(funderData: any) {
    console.log('funderData received in onSelectedFunder:', funderData);

    if (!this.assignedFunder) {
      this.assignedFunder = [];
    }

    const newFunder = { ...funderData[0] };

    console.log('newFunder:', newFunder);

    const funderExists = this.assignedFunder.some(
      (donor: any) => donor.funderId === newFunder.funderId,
    );

    if (funderExists) {
      console.log('Funder already exists in assignedFunder. Cannot add again.');
      return;
    }

    console.log(
      'Before adding new funder, assignedFunder:',
      this.assignedFunder,
    );

    // Check if funder already exists
    const existingDonorIndex = this.assignedFunder.findIndex(
      (donor: any) => donor.funderId === newFunder.funderId,
    );

    console.log('existingDonorIndex:', existingDonorIndex);

    if (existingDonorIndex !== -1) {
      console.log('Funder already exists, updating contribAmt...');
      this.assignedFunder[existingDonorIndex].contribAmt +=
        newFunder.contribAmt;
    } else {
      console.log('Adding new funder...');
      this.assignedFunder.push(newFunder);
    }

    console.log('this.assignedFunder after assignment:', this.assignedFunder);

    this.onSubmit(newFunder);

    this.donorTotal = this.calculateDonorTotal(this.assignedFunder);
    console.log('this.donorTotal:', this.donorTotal);
  }

  calculateDonorTotal(donors: any[]): number {
    console.log('donors:', donors);
    return donors.reduce((total, donor) => total + donor.contribAmt, 0);
  }

  onSubmit(funderData: any): void {
    console.log('Submitting:', funderData);
    console.log('this.assignedFunder in onSubmit:', this.assignedFunder);

    this.assignedFundId = this.assignedFunder.map((item) => ({
      fundId: item.fundId,
      contribAmt: item.contribAmt,
    }));
    console.log('this.assignedFundId:', this.assignedFundId);

    this.form.reset();
  }

  deleteDonor(data: any) {
    this.assignedFunder.splice(0, 1);
    this.donorTotal = this.calculateDonorTotal(this.assignedFunder);
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
      // finApprAmount: this.donorTotal,
      assignedDonors: this.assignedFunder,
      // assignedDonors: this.assignedDonors.map((fin) => ({
      //   funderId: fin.funderId,
      //   contribAmt: fin.donotedAmt,
      // })),
    };

    console.log('finalList:', finalList);
    this.requestService.finDonorAssign(this.reqId, finalList).subscribe(
      (res: any) => {
        console.log('successfully indent request accept by finance:', res);
        this.isApproved = true;
      },
      (error) => {
        console.error('error while approving the financial:', error);

        if (error.status) {
          alert('Successfully Failed!');
        }
      },
    );
  }

  closepop(data: boolean) {
    this.isApproved = data;
    this.isRejectPop = data;
    this.isWarningPopup = data;
    this.closeView.emit(false);
  }

  close(data: boolean) {
    console.log('Close event received:', data);
    this.isViewFundDetails = !data;
  }

  fetchReason() {
    this.requestService.commands().subscribe((res) => {
      // this.commend = res;
      // console.log("this.commend:", this.commend);
      this.commendArray = Object.entries(res)
        .map(([key, value]) => ({
          key,
          value,
        }))
        .filter((item) => item.key !== '0');
      console.log('this.commend:', this.commendArray);
    });
  }
  postReason(data: any) {
    console.log('reason for holding or rejection:', data);
    console.log('typeof reason for holding or rejection:', typeof data);

    const numericData = Number(data);
    console.log('Converted numeric data:', numericData);
    console.log('typeof Converted numeric data:', typeof numericData);

    if (this.isHolding == true && this.isReject == false) {
      this.requestService
        .holdOrRejectcomments(this.reqId, numericData, 1)
        ?.subscribe(
          (res) => {
            console.log('successfully hold the request:', res);
            this.isWarningPopup = true;
          },
          (error) => {
            console.log('error while holding the request:', error);
            if (error.status == 200) {
              alert('This Request is on Hold');
              this.closeView.emit(false);
            }
          },
        );
    }
    if (this.isHolding == false && this.isReject == true) {
      this.requestService
        .holdOrRejectcomments(this.reqId, numericData, 2)
        ?.subscribe(
          (res) => {
            console.log('successfully rejected the request:', res);
            this.isRejectPop = true;
          },
          (error) => {
            console.log('error while rejecting the request:', error);
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
    console.log('check:', check);
    console.log('check:', check.getTime());
    let date = check.getTime() / 1000;
    console.log('getting date:', date);

    this.caldate = this.shared.calculateDateDifference(date);
    console.log('final date:', this.caldate);
  }
}
