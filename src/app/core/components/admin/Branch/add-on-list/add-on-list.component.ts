import { Component } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-on-list',
  templateUrl: './add-on-list.component.html',
  styleUrl: './add-on-list.component.css',
})
export class AddOnListComponent {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalpage: number = 0;
  listLength: any;

  headOfAccList: any[] = [];

  headOfAccForm: FormGroup;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
  ) {
    this.headOfAccForm = this.fb.group({
      headOfAccName: [],
    });
  }
  ngOnInit() {
    this.fetchHeadOfAcc();
  }

  fetchHeadOfAcc() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.productService.getHeadofAccList().subscribe((res: any) => {
      console.log(res);

      this.headOfAccList = res;
      this.listLength = this.headOfAccList.length;
    });
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
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
