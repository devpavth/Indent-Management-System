import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-r-stock',
  templateUrl: './r-stock.component.html',
  styleUrl: './r-stock.component.css',
})
export class RStockComponent implements OnInit {
  dateRange: FormGroup;
  constructor(
    private readonly productService: ProductService,
    private readonly fb: FormBuilder,
    private location: Location,
  ) {
    this.dateRange = this.fb.group({
      from: [],
      to: [],
    });
  }
  ngOnInit() {
    // let data = {
    //   start: '2024-07-17 00:00:00.000000',
    //   end: '2024-07-21 00:00:00.000000',
    // };
    // this.productService.getStockReport(data).subscribe((res: any) => {
    //   console.log(res);
    // });
  }
  onSubmit(data: any) {
    console.log(data);

    this.productService.getStockReport(data).subscribe(
      (res: any) => {
        console.log(res);
        console.log('Response body:', res.body);
        console.log('Response headers:', res.headers.url);
      },
      (error) => {
        if (error.status == 200) {
          console.log(error);

          console.log('Response headers:', error.url);
          const url = error.url;
          window.open(url, '_blank');
        }
      },
    );
  }
  setBrowserUrl(): void {
    const url =
      'http://192.168.1.11:9004/product/stockreport?startDate=2024-07-17&endDate=2024-07-24';
    window.open(url, '_blank');
  }
}
