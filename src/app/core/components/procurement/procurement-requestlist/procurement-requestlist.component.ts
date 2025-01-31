import { Component } from '@angular/core';
import { RequestService } from '../../service/Request/request.service';

@Component({
  selector: 'app-procurement-requestlist',
  templateUrl: './procurement-requestlist.component.html',
  styleUrl: './procurement-requestlist.component.css'
})
export class ProcurementRequestlistComponent {

  currentDate: string | undefined;
  maxDate: string | undefined;
  isViewSelectedDate: boolean = true;

  ngOnInit(){
    console.log("checking procurement list");
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
        this.req.fetchPrctReqList(status).subscribe((res) => {
          this.userRequest = res;
          console.log("fetching procurement request processing list:", res);
        },
        (error) => {
          console.log("error while fetching processing procurement request:", error);
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
        this.req.fetchPrctReqList(202, this.currentDate).subscribe(
          (res: any) => {
            console.log("fetching completed procurement request:", res);
            // let list: any[] = res;
            // console.log("listing completed:", list);
            // list = list.filter((l) => l.requestStatus == 102);
            // console.log("filtering completed request:", list);
            this.userRequest = res;
          },
          (error) => {
            console.log("error while fetching completed procurement request:", error);
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
        this.isViewSelectedDate = false;
        this.req.fetchPrctReqList(418).subscribe(
          (res: any) => {
            console.log("fetching procurement request on hold list:", res);
            this.userRequest = res;
          },
          (error) => {
            console.log("error while fetching on hold procurement request:", error);
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
        this.req.fetchPrctReqList(406, this.currentDate).subscribe(
          (res: any) => {
            console.log("fetching procurement request rejected list:", res);
            this.userRequest = res;
          },
          (error) => {
            console.log("error while fetching rejected procurement request:", error);
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
