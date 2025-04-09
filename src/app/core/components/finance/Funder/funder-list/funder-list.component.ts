import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FunderService } from '../../../service/Funder/funder.service';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-funder-list',
  templateUrl: './funder-list.component.html',
  styleUrl: './funder-list.component.css',
})
export class FunderListComponent implements OnInit {
  @ViewChild('funderInput') funderInput!: ElementRef<HTMLInputElement>;
  selectedFunderName: string = '';
  isFunderList: Boolean = false;
  funderData: any;

  funderList: any[] = [];
  isShowPagination: boolean = true;
  offSet: number = 0;
  pageSize: number = 10;
  listLength: any;

  searchSubject: Subject<string> = new Subject();
  isFunderSelected: boolean = false;
  noFunder: boolean = false;
  funderSearchList: any[] = [];

  constructor(private funderService: FunderService) {}

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          if (this.isFunderSelected) {
            return of([]);
          }
          this.noFunder = false;
          if (!searchTerm || searchTerm.length < 3) {
            this.funderSearchList = [];
            return of([]);
          }
          return this.funderService.funderList({ searchTerm }).pipe(
            catchError((error) => {
              if (error.status === 404) {
                console.log('Funder API Error:', error);
                this.noFunder = true;
              }
              return of([]);
            }),
          );
        }),
      )
      .subscribe((response: any) => {
        console.log('fetching funder data from backend:', response);

        if (response.length > 0) {
          this.selectedFunderName = response[0].funderName;
          this.setFunderInputValue();
        }

        this.funderList = response;
        this.isFunderSelected = false;
      });

    // this.getAllFunderList();
  }

  setFunderInputValue() {
    if (this.funderInput) {
      this.funderInput.nativeElement.value = this.selectedFunderName;
    }
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchSubject.next(searchTerm);
  }

  // getAllFunderList(offSet: number = this.offSet, pageSize: number = this.pageSize) {
  //   this.funderService.funderList({offSet: offSet?.toString(), pageSize: pageSize?.toString()}).subscribe((res: any) => {
  //     this.funderList = res;
  //     console.log("fetching funder list:", res);
  //     this.listLength = this.funderList.length;
  //     this.isShowPagination = true;
  //   });
  // }

  onPageChange(pageNumber: number): void {
    console.log('Current Offset:', this.offSet, 'New Offset:', pageNumber);
    // if (pageNumber >= 0 || pageNumber * this.pageSize < this.listLength) {
    //   return;
    // }

    this.offSet = pageNumber;
    console.log('this.offSet:', this.offSet);
    // this.getAllFunderList(this.offSet, this.pageSize);
  }

  get startPage(): number {
    return this.pageSize * this.offSet + 1;
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
      // this.getAllFunderList();
    }
  }
}
