import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrl: './product-stock.component.css',
})
export class ProductStockComponent implements OnInit {
  @Output() closeStockView = new EventEmitter<boolean>();
  @Input() productId: string = '';
  units: { id: number; name: string }[] = [
    { id: 1, name: 'Kg' },
    { id: 2, name: 'L' },
    { id: 3, name: 'm' },
    { id: 4, name: 'Unit' },
    { id: 200, name: 'Box' },
  ];
  stockList: any;
  hasTotalPieces: boolean = false;
  constructor(private productService: ProductService) {}
  ngOnInit() {
    console.log(this.productId);
    this.fetchStock();
  }
  fetchStock() {
    this.productService
      .getStockDetails(this.productId)
      .subscribe((res: any) => {
        console.log(res);
        this.stockList = res.map((stock: any) => ({
          ...stock,
          unitName: this.getUnitName(stock.prdUnit),
        }));
        this.hasTotalPieces = this.stockList.some(
          (stock: any) => stock.totalPieces != 0,
        );
        console.log(this.stockList.totalPieces);
      });
  }

  getUnitName(prdUnit: number): string {
    const unit = this.units.find((unit) => unit.id === prdUnit);
    return unit ? unit.name : 'Unknown';
  }
}
