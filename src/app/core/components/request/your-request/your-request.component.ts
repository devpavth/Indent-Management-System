import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-your-request',
  templateUrl: './your-request.component.html',
  styleUrl: './your-request.component.css',
})
export class YourRequestComponent implements OnInit {
  _yourReq: any;
  RequestID: any;
  isCreated: boolean = true;
  isProcess: boolean = false;
  isCompleted: boolean = false;
  isRejected: boolean = false;

  isViewReq: boolean = false;

  constructor(private readonly reqService: RequestService) {}
  ngOnInit(): void {
    this.fetchYourRequest();
  }
  // 102 p,200 c,406 rej
  fetchYourRequest() {
    if (
      (this.isCreated == true,
      this.isProcess == false &&
        this.isCompleted == false &&
        this.isRejected == false)
    ) {
      let status = 201;
      this.reqService.getYourReq(status).subscribe(
        (res) => {
          this._yourReq = res;
          console.log(res);
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }

    if (
      (this.isCreated == false,
      this.isProcess == true &&
        this.isCompleted == false &&
        this.isRejected == false)
    ) {
      let status = 102;
      this.reqService.getYourReq(status).subscribe(
        (res) => {
          this._yourReq = res;
          console.log(res);
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
    if (
      (this.isCreated == false,
      this.isProcess == false &&
        this.isCompleted == true &&
        this.isRejected == false)
    ) {
      let status = 200;
      this.reqService.getYourReq(status).subscribe(
        (res) => {
          this._yourReq = res;
          console.log(res);
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
    if (
      (this.isCreated == false,
      this.isProcess == false &&
        this.isCompleted == false &&
        this.isRejected == true)
    ) {
      let status = 406;
      this.reqService.getYourReq(status).subscribe(
        (res) => {
          this._yourReq = res;
          console.log(res);
        },
        (error) => {
          if (error.status == 204) {
            this._yourReq = undefined;
          }
        },
      );
    }
  }
  closeView(data: any) {
    this.isViewReq = data;
  }

  viewRequest(data: any) {
    this.RequestID = data;
    console.log(data);

    this.isViewReq = true;
  }
}
