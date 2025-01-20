import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrl: './view-request.component.css',
})
export class ViewRequestComponent implements OnInit {
  @Output() closeView = new EventEmitter<boolean>();
  @Input() IndentID: any;
  @Input() showID: number = 0;
  isRejected: boolean = false;
  isApproved: boolean = false;
  isRejectPop: boolean = false;
  commendArray: { key: string; value: string }[] = [];

  date: any = new Date();
  _requestDetails: any;
  isViewProgramManagerApproval: boolean = false;
  isViewBranchApproval: boolean = false;

  constructor(private readonly requstService: RequestService) {}
  ngOnInit(): void {
    this.fetchReason();
    console.log('hello', this.showID);

    console.log(this.IndentID);

    this.fetchDetails(this.IndentID);
  }
  fetchDetails(data: any) {
    this.requstService.viewReq(data).subscribe((res) => {
      console.log("fetching details:", res);
      this._requestDetails = res;

      if(this._requestDetails.progarmMgrAuthData.authStatusCode === 202){
        this.isViewProgramManagerApproval = true;
      }
      if(this._requestDetails.branchAuthData.authStatusCode === 202){
        this.isViewBranchApproval = true;
      }

      console.log(this._requestDetails.branchAuthorize);
    });
  }
  approvel() {
    if(this.showID === 1){
      this.requstService
        .programManagerApproval(this._requestDetails.indentHeaders.sno)
        .subscribe(
          (res) => {
            console.log('program manager Approval success', res);
            this.isApproved = true;
          },
          (error) => {
            if(error.status === 202){
              this.isApproved = true;
            }
            if(error.status === 208){
              console.error('Approve error: Action already made');
            }
          }
        )
        
    }
    if (this.showID === 2) {
      this.requstService
        .branchApprovel(this._requestDetails.indentHeaders.sno)
        .subscribe(
          (res) => {
            console.log('branch Approvel success', res);
            this.isApproved = true;
          },
          (error) => {
            if (error.status === 202) {
              this.isApproved = true;
            }
            if (error.status === 208) {
              console.error('Approve error: Action already made');
            }
          },
        );
    }
    if (this.showID === 3) {
      console.log('admin');

      this.requstService
        .adminApprovel(this._requestDetails.indentHeaders.sno)
        .subscribe(
          (res) => {
            console.log('admin Approval succes', res);
            this.isApproved = true;
          },
          (error) => {
            if (error.status === 202) {
              this.isApproved = true;
            }
            if (error.status === 208) {
              console.error('Approve error: Action already made');
            }
          },
        );
    }
  }
  rejected(sno: any, data: any) {
    console.log("rejecting the requset:", sno, data);

    if(this.showID === 1){
      this.requstService.programManagerRejection(sno, data).subscribe(
        (res) => {
          console.log("program manager rejection response:", res);
          this.isRejected = false;
          this.isRejectPop = true;
          // this._requestDetails = '';
        },
        (error) => {
          console.log("error while rejecting the request:", error);
          if (error.status === 202) {
            this.isRejected = false;
            this.isRejectPop = true;
          }
          if (error.status === 208) {
            console.error('Rejected error: Action already made');
          }
        }
      )
    }

    if (this.showID === 2) {
      this.requstService.branchReject(sno, data).subscribe(
        (res) => {
          console.log("branch manager rejected the indent request:", res);
          this.isRejected = false;
          this.isRejectPop = true;
        },
        (error) => {
          if (error.status === 202) {
            this.isRejected = false;
            this.isRejectPop = true;
          }
          if (error.status === 208) {
            console.error('Rejected error: Action already made');
          }
        },
      );
    }
    if (this.showID === 3) {
      console.log(sno, data);
      this.requstService.adminReject(sno, data).subscribe(
        (res) => {
          console.log("admin rejected the indent request:", res);
          this.isRejected = false;
          this.isRejectPop = true;
        },
        (error) => {
          if (error.status === 202) {
            this.isRejected = false;
            this.isRejectPop = true;
          }
          if (error.status === 208) {
            console.error('Rejected error: Action already made');
          }
        },
      );
    }
  }
  closepop(data: boolean) {
    this.isApproved = data;
    this.isRejectPop = data;
    this.closeView.emit(false);
  }
  fetchReason() {
    this.requstService.commands().subscribe((res) => {
      console.log("fetching comments:", res);
      this.commendArray = Object.entries(res).map(([key, value]) =>({
        key,
        value,
      }))
      .filter((item) => item.key !== '0');
      console.log("this.commend:", this.commendArray);
    });
  }
}
