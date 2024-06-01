import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';
import { SharedServiceService } from '../../service/shared-service/shared-service.service';

@Component({
  selector: 'app-requisition-list',
  templateUrl: './requisition-list.component.html',
  styleUrl: './requisition-list.component.css',
})
export class RequisitionListComponent implements OnInit {
  ngOnInit() {
    this.fetchRequestList();
  }
  constructor(private req: RequestService) {}
  isProcess = true;
  isCompleted = false;
  isRejected = false;
  isView = false;
  userRequest: any;

  reqId: any;

  fetchRequestList() {
    if (
      this.isProcess == true &&
      this.isCompleted == false &&
      this.isRejected == false
    ) {
      let status = 102;
      this.req.finRequestList(status).subscribe((res) => {
        this.userRequest = res;
        console.log(res);
      });
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
