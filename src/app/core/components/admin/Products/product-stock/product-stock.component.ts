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
  units: { id: number; name: string; term: string }[] = [
    { id: 1, name: 'Kg', term: 'Kilograms' },
    { id: 2, name: 'L', term: 'Liters' },
    { id: 3, name: 'M', term: 'Meter' },
    { id: 4, name: 'Unit', term: 'Piece' },
    { id: 5, name: 'Lt', term: 'Liters' },
    { id: 6, name: 'Feet', term: 'Feet' },
    { id: 7, name: 'Roll', term: 'Roll' },
    { id: 8, name: 'Dcm', term: 'Decimeters' },
    { id: 9, name: 'Bag', term: 'Bag' },
    { id: 10, name: 'Pair', term: 'Pair' },
    { id: 11, name: 'Tin', term: 'Tin' },
    { id: 12, name: 'Sheet', term: 'Sheet' },
    { id: 13, name: 'Ream', term: 'Ream' },
    { id: 14, name: 'No', term: 'Number' },
    { id: 15, name: 'Meter', term: 'Meter' },
    { id: 200, name: 'Box', term: 'Box' },
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
