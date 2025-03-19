import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Company } from '../../../../models/company/company.model';
import { BranchService } from '../../../service/Branch/branch.service';
import { ToastService } from '../../../service/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-companydetails',
  templateUrl: './view-companydetails.component.html',
  styleUrl: './view-companydetails.component.css',
})
export class ViewCompanydetailsComponent {
  @Input() companyDetails: Company | undefined;
  @Output() close = new EventEmitter<boolean>();

  initialCompanyName: string = '';
  updatedCompanyName: string = '';

  isViewUploadLogo: boolean = false;

  branchService = inject(BranchService);
  toastService = inject(ToastService);
  route = inject(Router);

  ngOnInit(){
    if(this.companyDetails?.companyName){
      this.updatedCompanyName = this.companyDetails.companyName;
      this.initialCompanyName = this.companyDetails.companyName;
    }
  }

  isDisabled(): boolean{
    return this.initialCompanyName.trim() === this.updatedCompanyName.trim()
  }

  uploadLogo() {
    this.isViewUploadLogo = true;
  }

  updateCompanyName(updatedCompanyName: string) {
    this.branchService.updateCompanyName(updatedCompanyName).subscribe(
      (res: any) => {
        console.log("successfully updated company name:", res);

        this.toastService.showSuccess(res.error);

        setTimeout(() => {
          this.onClose();
          this.route.navigate(['/home/companyList']);
        }, 3000);
      },
      (error) => {
        console.log("error while updating company name:", error);
      }
    )
  }

  fetchCompanyDetails(){
    this.branchService.fetchCompanyName().subscribe(
      (res) => {
        console.log('fetching company details:', res);
        this.companyDetails = res;
      },
      (error) => {
        console.log('error while fetching company details:', error);
      }
    )
  }

  onClose() {
    this.close.emit(true);
  }

  closeUploadCompanyLogo(closeIcon: boolean) {
    this.isViewUploadLogo = !closeIcon;

    if(closeIcon){
      this.fetchCompanyDetails();
    }
  }
}
