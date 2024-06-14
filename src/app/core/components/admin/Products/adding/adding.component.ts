import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrl: './adding.component.css',
})
export class AddingComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() addData: any;

  GroupForm: FormGroup;
  ngOnInit() {
    console.log(this.addData);
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.GroupForm = this.fb.group({
      prdgrpName: [],
      prdgrpStatus: [200],
    });
  }

  submitGroup(data: any) {
    console.log(data);

    this.productService.addGroup(data).subscribe((res) => {
      console.log(res);
    });
  }
}
