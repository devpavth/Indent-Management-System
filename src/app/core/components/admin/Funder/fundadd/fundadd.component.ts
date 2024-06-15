import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { FunderService } from '../../../service/Funder/funder.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fundadd',
  templateUrl: './fundadd.component.html',
  styleUrl: './fundadd.component.css',
})
export class FundaddComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() funderId: any;

  branchList: any;
  assignedBranch: any;
  addFund: FormGroup;

  constructor(
    private branchService: BranchService,
    private funderService: FunderService,
    private fb: FormBuilder,
  ) {
    this.addFund = this.fb.group({});
  }
  ngOnInit() {
    this.fetchBranchList();
    this.funderBranchlist();
    console.log(this.funderId);
  }
  fetchBranchList() {
    this.branchService.getBranch().subscribe((res) => {
      console.log(res);
      this.branchList = res;
    });
  }

  assignFunder(data: any) {
    console.log(data);

    this.funderService
      .assignFundertoBranch(data, this.funderId)
      .subscribe((res) => {
        console.log(res);
      });
  }
  funderBranchlist() {
    this.funderService.assignedBranch(this.funderId).subscribe((res) => {
      this.assignedBranch = res;
      console.log(res);
    });
  }
}
