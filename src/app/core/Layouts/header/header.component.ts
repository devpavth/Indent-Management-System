import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { EmployeeServiceService } from '../../components/service/Employee/employee-service.service';
import { SharedServiceService } from '../../components/service/shared-service/shared-service.service';
import { BranchService } from '../../components/service/Branch/branch.service';
import { Company } from '../../models/company/company.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user: any; // fetch user
  userData: any; //fetch user data object

  companyDetails: Company | undefined;

  //User data
  // FirstName :any
  // LastName:string=''
  // Id:string=''
  // Phone:number=0
  // Gender:	string=''
  // Email:	string=''
  // DateofBirth:any
  // addressLine1:string=''
  // addressLine2:string=''
  // state:string=''
  // city:string=''
  // pin	:number=0
  // country	:string=''
  // empJoiningDate :any
  // empRole	:string=''
  // empBranch	:string=''
  // empDepartment	:string=''
  // empDesignation	:string=''
  // empFlag:string=''

  randomColor: string | undefined;

  branchService = inject(BranchService);

  constructor(
    private readonly userDetailService: EmployeeServiceService,
    public sharedData: SharedServiceService,
    private elRef: ElementRef,
  ) {
    this.randomColor = this.getRandomColor();
  }
  ngOnInit(): void {
    this.user = sessionStorage.getItem('userId');
    if (this.user) {
      this.userDetailService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log('this.userData:', this.userData);
        console.log('this.userData:', this.userData.branchId);

        sessionStorage.setItem('branchId', this.userData.branchCode);
      });
    }

    this.fetchCompany();
  }

  fetchCompany(){
    this.branchService.fetchCompanyName().subscribe(
      (res: Company) => {
        console.log("fetching coming details:", res);
        this.companyDetails = res;
      },
      (error) => {
        console.log("error while fetching company details", error);
      }
    )
  }

  getRandomColor(): string {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // Construct the CSS color string
    return `rgb(${r}, ${g}, ${b})`;
  }

  profile: boolean = false; //toggle declare

  name = sessionStorage.getItem('userId');

  toggleSetting() {
    this.profile = !this.profile;
    setTimeout(() => {
      this.profile = false;
    }, 9000);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.profile = false;
    }
  }

  signOut() {
    sessionStorage.clear();
  }
}
