import { Component } from '@angular/core';
import { RequestService } from '../../core/components/service/Request/request.service';

@Component({
  selector: 'app-confirm-branch-details',
  templateUrl: './confirm-branch-details.component.html',
  styleUrl: './confirm-branch-details.component.css'
})
export class ConfirmBranchDetailsComponent {

  branchDetails: any;
  isConfirm = false;

  constructor(private requestService: RequestService,){
  }

  ngOnInit(){
    this.fetchBranchDetails();
  }

  fetchBranchDetails(){
    this.requestService.getBranchDetails().subscribe((res) =>{
      this.branchDetails = Array.isArray(res) ? res : [res];
      console.log("Response from branchDetailsApi:", res);
    },(error)=>{
      console.error("Error fetching branch details:", error);
    })
  }

  confirmBranchDetailsBtn(){
    // console.log("logging:", this.branchDetails[0].branchMobileNumber);
    this.isConfirm = true;
  }
}
