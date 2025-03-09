import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { FunderService } from '../../../service/Funder/funder.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fundadd',
  templateUrl: './fundadd.component.html',
  styleUrl: './fundadd.component.css',
})
export class FundaddComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() funderId: any;

  branchList: any;

  addFund: FormGroup;

  assignBranchList: any;
  isToast: boolean = false;
  deleteToastMsg: any;
  isDeleteToast: boolean = false;
  errorToastMsg: any

  constructor(
    private branchService: BranchService,
    private funderService: FunderService,
    private fb: FormBuilder,
  ) {
    this.addFund = this.fb.group({
      fundIn: [],
      fundId: [],
      branchId: [],
      newFundAmt: [],
    });
  }
  ngOnInit() {
    this.fetchBranchList();
    this.funderBranchlist();
    console.log(this.funderId);
    this.addFund.get('fundIn')?.disable();
  }
  // fetchBranchList() {
  //   this.funderService.assignedBranch(this.funderId).subscribe((res: any) => {
  //     this.assignBranchList = res;
  //     console.log("assigning branch:", res);
  //   });

  //   this.branchService.getBranch().subscribe((res: any) => {
  //     console.log("fetching branch:", res);
  //     this.branchList = res;
  //     this.branchList.unshift({branchId: 0, branchName: 'Common Fund'});
  //     console.log("after adding one more branch:", this.branchList);

  //     console.log("assignBranchList:", this.assignBranchList);

  //     if (!this.assignBranchList || this.assignBranchList.length === 0) {
  //       console.log('assignBranchList is empty. No filtering will be applied.');
  //     }

  //     this.branchList = this.branchList?.filter(
  //       (branch: any) => {
  //         const isAssigned = this.assignBranchList?.some(
  //           (assignedBranch: any) => {
  //             return assignedBranch.branchId === branch.branchId
  //           }
  //         )
  //         console.log(`Branch: ${branch.branchName}, Assigned: ${isAssigned}`);
  //         return !isAssigned;
  //       }
  //     )
  //     console.log("after filtering branch:", this.branchList);
  //   });
  // }

  fetchBranchList() {
    forkJoin({
      assignBranchList: this.funderService.assignedBranch(this.funderId),
      branchList: this.branchService.getBranch(),
    }).subscribe(({ assignBranchList, branchList }) => {
      this.assignBranchList = assignBranchList;
      console.log("assigning branch:", assignBranchList);
  
      this.branchList = branchList;
      this.branchList.unshift({ branchId: 0, branchName: 'Common Fund' });
      console.log("fetching branch:", branchList);
      console.log("after adding one more branch:", this.branchList);
  
      if (!this.assignBranchList || this.assignBranchList.length === 0) {
        console.log('assignBranchList is empty. No filtering will be applied.');
      } else {
        this.branchList = this.branchList.filter((branch: any) => {
          const isAssigned = this.assignBranchList.some(
            (assignedBranch: any) => assignedBranch.branchId === branch.branchId
          );
          console.log(`Branch: ${branch.branchName}, Assigned: ${isAssigned}`);
          return !isAssigned;
        });
      }
  
      console.log("after filtering branch:", this.branchList);
    });
  }

  assignFunder(data: any) {
    console.log("assigning funder:", data);

    this.funderService.assignFundertoBranch(data, this.funderId).subscribe(
      (res: any) => {
        console.log("assigning funder response:", res);
        this.isToast = true;
        this.deleteToastMsg = res.errorMessege;
        setTimeout(() => {
          this.isToast = false;
          this.fetchBranchList();
          this.close.emit(false);
        }, 3000)
      },
      (error) => {
        console.log("error in branch:", error);
        this.isDeleteToast = true;
        this.errorToastMsg = error.error.errorMessege;
        setTimeout(() => {
          this.isDeleteToast = false;
          this.close.emit(false);
        }, 3000)
        this.funderBranchlist();
      },
    );
  }
  funderBranchlist() {
    this.funderService.assignedBranch(this.funderId).subscribe((res: any) => {
      this.assignBranchList = res;
      console.log("assigning branch:", res);
    });
  }
  setValue(data: any) {
    let value: any[] = this.assignBranchList;
    let select_Value = value.find((f) => f.branchId == data);
    console.log(select_Value);
    this.addFund.patchValue({
      fundIn: select_Value.fundInHand,
      fundId: select_Value.fundId,
    });
  }
  onSubmit(data: any) {
    console.log("this.funderId:", this.funderId);

    console.log("sending fund data:", data);

    this.funderService.addFund(data, this.funderId).subscribe(
      (res: any) => {
        console.log("adding fund amount:", res);
        this.isToast = true;
        this.deleteToastMsg = res.errorMessege;
        setTimeout(() => {
          this.isToast = false;
          this.close.emit(false);
        }, 3000)
      },
      (error) => {
        console.log("error while adding fund amount:", error);

        // alert(error.error.text);
        this.funderBranchlist();
        this.addFund.reset();
      },
    );
  }
}
