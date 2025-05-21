import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateService {
  sectionStates = {
    tRequest: new BehaviorSubject(false),
    finance: new BehaviorSubject(false),
    procurement: new BehaviorSubject(false),
    poapproval: new BehaviorSubject(false),
    tAdmin: new BehaviorSubject(false),
    company: new BehaviorSubject(false),
    employee: new BehaviorSubject(false),
    product: new BehaviorSubject(false),
    branch: new BehaviorSubject(false),
    transaction: new BehaviorSubject(false),
    report: new BehaviorSubject(false),
  };

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (
        'routerEvent' in event &&
        event.routerEvent instanceof NavigationEnd
      ) {
        const currentUrl = event.routerEvent.urlAfterRedirects;
        this.resetAllSections();
        this.setActiveSection(currentUrl);
      }
    });
  }

  resetAllSections() {
    Object.values(this.sectionStates).forEach((subject) => subject.next(false));
  }

  setActiveSection(url: string) {
    const sectionMap = {
      tRequest: [
        '/home/request',
        '/home/userRequest',
        '/home/managerApproval',
        '/home/branchApprovel',
        '/home/adminApprovel',
        '/home/unauth',
      ],
      finance: ['/home/funderList', '/home/finRequestList', '/home/unauth'],
      procurement: ['/home/proReqList', '/home/POList', '/home/unauth'],
      poapproval: ['/home/ceocfoapproval', '/home/unauth'],
      tAdmin: ['/home/vendorList', '/home/unauth'],
      company: ['/home/companyList', '/home/unauth'],
      employee: [
        '/home/employeeList',
        '/home/designationRoleMapping',
        '/home/unauth',
      ],
      product: ['/home/productList', '/home/headOfAcc', '/home/unauth'],
      branch: [
        '/home/branchList',
        '/home/viewList/1',
        '/home/viewList/2',
        '/home/unauth',
      ],
      transaction: ['/home/pTransaction', '/home/inwardAlert', '/home/unauth'],
      report: ['/home/indentReports', '/home/stockReports', '/home/unauth'],
    };

    if (sectionMap.tRequest.find((route) => route.includes(url))) {
      this.sectionStates.tRequest.next(true);
    } else if (sectionMap.finance.find((route) => route.includes(url))) {
      this.sectionStates.finance.next(true);
    } else if (sectionMap.procurement.find((route) => route.includes(url))) {
      this.sectionStates.procurement.next(true);
    } else if (sectionMap.poapproval.find((route) => route.includes(url))) {
      this.sectionStates.poapproval.next(true);
    } else if (sectionMap.tAdmin.find((route) => route.includes(url))) {
      this.sectionStates.tAdmin.next(true);
    } else if (sectionMap.company.find((route) => route.includes(url))) {
      this.sectionStates.company.next(true);
    } else if (sectionMap.employee.find((route) => route.includes(url))) {
      this.sectionStates.employee.next(true);
    } else if (sectionMap.product.find((route) => route.includes(url))) {
      this.sectionStates.product.next(true);
    } else if (sectionMap.branch.find((route) => route.includes(url))) {
      this.sectionStates.branch.next(true);
    } else if(sectionMap.transaction.find(route => route.includes(url))){
      this.sectionStates.transaction.next(true);
    } else if(sectionMap.report.find(route => route.includes(url))){
      this.sectionStates.report.next(true);
    }
  }

  get tRequest$() {
    return this.sectionStates.tRequest.asObservable();
  }

  get finance$() {
    return this.sectionStates.finance.asObservable();
  }

  get procurement$() {
    return this.sectionStates.procurement.asObservable();
  }

  get poapproval$() {
    return this.sectionStates.poapproval.asObservable();
  }

  get tAdmin$() {
    return this.sectionStates.tAdmin.asObservable();
  }

  get company$() {
    return this.sectionStates.company.asObservable();
  }

  get employee$() {
    return this.sectionStates.employee.asObservable();
  }

  get product$() {
    return this.sectionStates.product.asObservable();
  }

  get branch$() {
    return this.sectionStates.branch.asObservable();
  }

  get transaction$(){
    return this.sectionStates.transaction.asObservable();
  }

  get report$(){
    return this.sectionStates.report.asObservable();
  }
}
