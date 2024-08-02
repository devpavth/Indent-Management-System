import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from '../../../service/Branch/branch.service';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.css',
})
export class ViewListComponent {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  listLength: any;

  headOfAccList: any[] = [];

  activeId: any;

  headOfAccForm: FormGroup;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private activeLinkId: ActivatedRoute,
    private branchService: BranchService,
  ) {
    this.headOfAccForm = this.fb.group({
      headOfAccName: [],
    });
  }
  ngOnInit() {
    this.activeId = this.activeLinkId.snapshot.paramMap.get('id');
    console.log(this.activeId);
    this.fetchHeadOfAcc();
  }

  fetchHeadOfAcc() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (this.activeId == 1) {
      this.branchService.getAllDepartments().subscribe((res: any) => {
        console.log(res);
        let list: any[] = res;
        this.headOfAccList = list.slice(startIndex, endIndex);
        this.listLength = this.headOfAccList.length;
      });
    } else if (this.activeId == 2) {
      this.branchService.getAllProj().subscribe((res: any) => {
        console.log(res);

        this.headOfAccList = res;
        this.listLength = this.headOfAccList.length;
      });
    }
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.fetchHeadOfAcc();
  }
  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }
  get startPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  get endPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.listLength);
  }

  onSubmit(accData: string) {
    this.productService.addHeadOfAcc(accData).subscribe(
      (res: any) => {
        console.log(res);
      },
      (error) => {
        console.log(error);

        if (error.status == 200) {
          this.fetchHeadOfAcc();
          this.headOfAccForm.reset();
        }
      },
    );
  }
}
