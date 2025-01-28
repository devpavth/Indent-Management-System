import { Component, OnInit } from '@angular/core';
import { FunderService } from '../../../service/Funder/funder.service';

@Component({
  selector: 'app-funder-list',
  templateUrl: './funder-list.component.html',
  styleUrl: './funder-list.component.css',
})
export class FunderListComponent implements OnInit {
  isFunderList: Boolean = false;
  funderData: any;

  funderList: any[] = [];
  isShowPagination: boolean = true;
  offSet: number = 0;
  pageSize: number = 10;
  listLength: any;

  constructor(private funderService: FunderService) {}

  

  ngOnInit() {
    this.getAllFunderList();
  }

  getAllFunderList(offSet: number = this.offSet, pageSize: number = this.pageSize) {
    this.funderService.funderList({offSet: offSet?.toString(), pageSize: pageSize?.toString()}).subscribe((res: any) => {
      this.funderList = res;
      console.log("fetching funder list:", res);
      this.listLength = this.funderList.length;
      this.isShowPagination = true;
    });
  }

  onPageChange(pageNumber: number): void {
    console.log('Current Offset:', this.offSet, 'New Offset:', pageNumber);
    // if (pageNumber >= 0 || pageNumber * this.pageSize < this.listLength) {
    //   return; 
    // }

    this.offSet = pageNumber;
    console.log("this.offSet:", this.offSet);
    this.getAllFunderList(this.offSet, this.pageSize);
  }

  get startPage(): number {
    return (this.pageSize) * this.offSet + 1;
  }
  get endPage(): number {
    const calculatedEnd = (this.offSet + 1) * this.pageSize;
    return Math.max(calculatedEnd, this.listLength);
  }

  toggleView(action: Boolean, check: number, funderData: any) {
    if (check == 1) {
      this.isFunderList = action;
      this.funderData = funderData;
    }
    if (check == 0) {
      this.isFunderList = action;
      this.getAllFunderList();
    }
  }
}
