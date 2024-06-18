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

  addFund: FormGroup;

  assignBranchList: any;

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
  fetchBranchList() {
    this.branchService.getBranch().subscribe((res) => {
      console.log(res);
      this.branchList = res;
    });
  }

  assignFunder(data: any) {
    console.log(data);

    this.funderService.assignFundertoBranch(data, this.funderId).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        this.funderBranchlist();
      },
    );
  }
  funderBranchlist() {
    this.funderService.assignedBranch(this.funderId).subscribe((res) => {
      this.assignBranchList = res;
      console.log(res);
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
    console.log(this.funderId);

    console.log(data);

    this.funderService.addFund(data, this.funderId).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);

        alert(error.error.text);
        this.funderBranchlist();
        this.addFund.reset();
      },
    );
  }
}
