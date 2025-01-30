import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-fund-details',
  templateUrl: './view-fund-details.component.html',
  styleUrl: './view-fund-details.component.css'
})
export class ViewFundDetailsComponent {
  @Input() funder: any;
  @Input() donarName: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() selectedFunderList = new EventEmitter<any>();
  @Output() funderId = new EventEmitter<any>();

  isToast: boolean = false;
  warningToastMsg: any;
  
  selectedFunderId: number | null = null;
  selectedBranchName: string = '';
  selectedBranchId: number | null = null;
  selectedFundAmt: number | null = null;
  // funderId: number | null = null;
  passFunder: any[] = [];

  ngOnInit(){
    console.log("this.funder:", this.funder);
  }

  toggleCheckBox(fundId: number){
    if(this.selectedFunderId === fundId){
      this.selectedFunderId = null;
      this.selectedBranchName = '';
      this.selectedBranchId = null;
      this.selectedFundAmt = null;
    }else{
      this.selectedFunderId = fundId;
      const selectedFunder = this.funder.find((f: any) => f.fundId === fundId);
      console.log('Selected Funder:', selectedFunder); 
      if(selectedFunder){
        console.log("Entered Amount:", selectedFunder.enteredAmount); 
        const { enteredAmount, branchId, branchName} = selectedFunder;
        this.selectedBranchId = branchId;
        this.selectedBranchName = branchName;
        this.selectedFundAmt = Number(enteredAmount);
        
        console.log("this.selectedFundAmt:", this.selectedFundAmt);
      }
    }
  }

  checkAmt(fundAmt: number, event: MouseEvent){
    if(fundAmt === 0){
      event.preventDefault();
      this.isToast = true;
      this.warningToastMsg = "Cannot Enter an Amount because Fund in Hand is 0.";
      setTimeout(()=>{
        this.isToast = false;
      }, 3000);
      return;
    }
  }

  validateAmount(fun: any){
    if(fun.enteredAmount > fun.fundInHand){
      fun.isInvalid = true;
      this.isToast = true;
      this.warningToastMsg = `Entered amount must be less than or equal to ${fun?.fundInHand}.`;
      setTimeout(() =>{
        this.isToast = false;
      }, 3000)
    }else{
      fun.isInvalid = false;
    }
  }

  isAmtValid(): boolean{
    const isValid = this.funder.some((fun: any) => fun.enteredAmount > fun.fundInHand);
    // console.log('Is Amount Valid:', isValid); 
    return isValid;
  }

  isCheckBoxSelected(): boolean{
    return !!this.selectedFunderId;
  }

  submit(fundId: any){
    const selectedFunder = this.funder.find((f: any) => f.fundId === fundId);
    console.log("selectedFunder", selectedFunder);
    console.log("selectedFunder enteredAmount:", selectedFunder.enteredAmount);

    console.log("Type of selectedFunder.enteredAmount before conversion:", typeof selectedFunder.enteredAmount);
    console.log("Type of this.selectedFundAmt after conversion:", typeof this.selectedFundAmt);

    this.selectedFundAmt = selectedFunder?.enteredAmount ? Number(selectedFunder.enteredAmount) : 0;

    console.log("this.selectedBranchId in save:", this.selectedBranchId);
    console.log("this.selectedBranchName in save:", this.selectedBranchName);
    console.log("this.selectedFundAmt in save:", this.selectedFundAmt);

    console.log("Type of selectedFunder.enteredAmount before conversion:", typeof selectedFunder.enteredAmount);
    console.log("Type of this.selectedFundAmt after conversion:", typeof this.selectedFundAmt);
    console.log("selectedFunder.funderId:", selectedFunder.funderId);


    // this.funderId = selectedFunder.funderId

    const funderPayload = 
    { 
      funderName: selectedFunder.funderName,
      funderId: selectedFunder.funderId,
      branchId: this.selectedBranchId,
      branchName: this.selectedBranchName,
      contribAmt: Number(this.selectedFundAmt),
      fundId: this.selectedFunderId,
    }

      console.log("Emitting funder data:", funderPayload);
      console.log("Emitting completed");
      this.passFunder = [funderPayload];

    this.selectedFunderList.emit(this.passFunder);

    console.log("this.selectedFunderList:", this.selectedFunderList);
    this.close.emit(true);
  }

  closePopUp(){
    this.close.emit(true);
  }
}
