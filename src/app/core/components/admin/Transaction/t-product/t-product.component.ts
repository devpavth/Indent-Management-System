import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-t-product',
  templateUrl: './t-product.component.html',
  styleUrl: './t-product.component.css',
})
export class TProductComponent implements OnInit {
  transactionData: any;
  vendor: any;
  inwardPrdDetails: any;
  constructor(private productService: ProductService) {}
  ngOnInit() {}
  fetchTransaction(id: any) {
    console.log(id);

    this.productService.productTransaction(id).subscribe((res: any) => {
      console.log(res);
      this.transactionData = res;
      const { transPrdDetails } = res;

      this.inwardPrdDetails = transPrdDetails;
    });
  }
}
