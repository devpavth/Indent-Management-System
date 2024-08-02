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
  commend: any;

  date: any = new Date();
  _requestDetails: any;
  constructor(private readonly requstService: RequestService) {}
  ngOnInit(): void {
    this.fetchReason();
    console.log('hello', this.showID);

    console.log(this.IndentID);

    this.fetchDetails(this.IndentID);
  }
  fetchDetails(data: any) {
    this.requstService.viewReq(data).subscribe((res) => {
      console.log(res);
      this._requestDetails = res;

      console.log(this._requestDetails.branchAuthorize);
    });
  }
  approvel() {
    if (this.showID === 2) {
      this.requstService
        .branchApprovel(this._requestDetails.indentHeaders.sno)
        .subscribe(
          (res) => {
            console.log('branch Approvel succes', res);
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
            console.log('branch Approvel succes', res);
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
    console.log(sno, data);

    if (this.showID === 2) {
      this.requstService.branchReject(sno, data).subscribe(
        (res) => {
          console.log(res);
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
          console.log(res);
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
      this.commend = res;
    });
  }
}
