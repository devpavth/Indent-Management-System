import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { EmployeeServiceService } from '../../components/service/Employee/employee-service.service';
import { SharedServiceService } from '../../components/service/shared-service/shared-service.service';
import { BranchService } from '../../components/service/Branch/branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user: any; // fetch user
  userData: any; //fetch user data object

  companyName: string | null = '';
  companyLogo: string | null = '';

  randomColor: string | undefined;

  branchService = inject(BranchService);
  route = inject(Router);

  constructor(
    private readonly userDetailService: EmployeeServiceService,
    public sharedData: SharedServiceService,
    private elRef: ElementRef,
  ) {
    this.randomColor = this.getRandomColor();
  }
  ngOnInit(): void {
    this.user = sessionStorage.getItem('userId');
    console.log('this.user in header:', this.user);
    console.log('checking header page');

    if (this.user) {
      this.userDetailService.getEmployeeDetails(this.user).subscribe((res) => {
        console.table(res);
        this.userData = res;

        console.log('this.userData:', this.userData);
        console.log('this.userData:', this.userData.branchId);

        sessionStorage.setItem('branchCode', this.userData.branchCode);
      });
    }

    this.companyName = sessionStorage.getItem('companyName');
    console.log('this.companyName in header:', this.companyName);

    this.companyLogo = sessionStorage.getItem('companyLogo');
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
    this.userDetailService.logoutApp().subscribe(
      (res) => {
        console.log('successfully logout:', res);
        sessionStorage.clear();
        this.route.navigate(['/login']);
      },
      (error) => {
        console.log('error while logout:', error);
        sessionStorage.clear();
        this.route.navigate(['/login']);
      },
    );
  }
}
