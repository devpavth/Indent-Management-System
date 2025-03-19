import { Component, inject } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { Company } from '../../../../models/company/company.model';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css',
})
export class CompanyDetailsComponent {
  branchService = inject(BranchService);

  companyDetails: Company | undefined;

  isViewCompanyDetails: boolean = false;
  Spinner: boolean = true;

  ngOnInit() {
    this.fetchCompanyDetails();
  }

  fetchCompanyDetails() {
    this.branchService.fetchCompanyName().subscribe(
      (res) => {
        console.log('fetching company details:', res);
        this.companyDetails = res;
        this.Spinner = false;
      },
      (error) => {
        console.log('error while fetching company details:', error);
      },
    );
  }

  updateCompanyDetails() {
    this.isViewCompanyDetails = true;
  }

  closeCompanyModal(closeIcon: boolean){
    this.isViewCompanyDetails = !closeIcon;

    if(closeIcon){
      this.fetchCompanyDetails();
    }
  }
}
