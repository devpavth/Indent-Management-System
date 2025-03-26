import { Component, inject } from '@angular/core';
import { BranchService } from '../../../service/Branch/branch.service';
import { Company } from '../../../../models/company/company.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css',
})
export class CompanyDetailsComponent {
  branchService = inject(BranchService);
  route = inject(Router);

  companyDetails: Company | undefined;

  isViewCompanyDetails: boolean = false;
  isSkeletonLoader: boolean = true;

  ngOnInit() {
    this.fetchCompanyDetails();
  }

  fetchCompanyDetails() {
    this.branchService.fetchCompanyName().subscribe(
      (res) => {
        console.log('fetching company details:', res);
        this.companyDetails = res;
        this.isSkeletonLoader = false;
      },
      (error) => {
        console.log('error while fetching company details:', error);
        this.isSkeletonLoader = false;
      },
    );
  }

  updateCompanyDetails() {
    this.isViewCompanyDetails = true;
  }

  closeCompanyModal(closeIcon: boolean) {
    this.isViewCompanyDetails = !closeIcon;

    if (closeIcon) {
      // this.fetchCompanyDetails();
      this.route.navigate(['/home/companyList']);
    }
  }
}
