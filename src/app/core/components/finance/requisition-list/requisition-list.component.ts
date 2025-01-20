import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-requisition-list',
  templateUrl: './requisition-list.component.html',
  styleUrl: './requisition-list.component.css',
})
export class RequisitionListComponent implements OnInit {
  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;
  
  ngOnInit() {
    this.fetchRequestList();
  }

  constructor(private req: RequestService) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }
  isProcess = true;
  isCompleted = false;
  isHold = false;
  isRejected = false;
  isView = false;
  userRequest: any;

  reqId: any;

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isHold == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.isViewSelectedDate = false;
      this.req.finRequestList(status).subscribe((res) => {
        this.userRequest = res;
        console.log("fetching finance request processing list:", res);
      },
      (error) => {
        console.log("error while fetching processing finance request:", error);
        if (error.status == 204) {
          this.userRequest = undefined;
        }else if(error.status === 404){
          this.userRequest = undefined;
        }
      },
    );
    }
    if (
      this.isProcess == false &&
      this.isCompleted == true &&
      this.isHold == false &&
      this.isRejected == false
    ) {
      this.isViewSelectedDate = true;
      this.req.finRequestList(202, this.currentDate).subscribe(
        (res: any) => {
          console.log("fetching completed finance request:", res);
          // let list: any[] = res;
          // console.log("listing completed:", list);
          // list = list.filter((l) => l.requestStatus == 102);
          // console.log("filtering completed request:", list);
          this.userRequest = res;
        },
        (error) => {
          console.log("error while fetching completed finance request:", error);
          if (error.status == 204) {
            this.userRequest = undefined;
          }else if(error.status === 404){
            this.userRequest = undefined;
          }
        },
      );
    }
    if(
      this.isProcess == false &&
      this.isCompleted == false &&
      this.isHold == true &&
      this.isRejected == false
    ){
      this.isViewSelectedDate = true;
      this.req.finRequestList(418, this.currentDate).subscribe(
        (res: any) => {
          console.log("fetching finance request on hold list:", res);
          this.userRequest = res;
        },
        (error) => {
          console.log("error while fetching on hold finance request:", error);
          if (error.status == 204) {
            this.userRequest = undefined;
          }else if(error.status === 404){
            this.userRequest = undefined;
          }
        }
      )
    }
    if(
      this.isProcess == false &&
      this.isCompleted == false &&
      this.isHold == false &&
      this.isRejected == true
    ){
      this.isViewSelectedDate = true;
      this.req.finRequestList(406, this.currentDate).subscribe(
        (res: any) => {
          console.log("fetching finance request rejected list:", res);
          this.userRequest = res;
        },
        (error) => {
          console.log("error while fetching rejected finance request:", error);
          if (error.status == 204) {
            this.userRequest = undefined;
          }else if(error.status === 404){
            this.userRequest = undefined;
          }
        }
      )
    }
  }
  viewRequest(data: any) {
    console.log(data);
    this.reqId = data;
    this.isView = true;
  }
  refresh(data: any) {
    this.isView = data;
    this.fetchRequestList();
  }
}
