import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../service/Product/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  gst: any = [5, 12, 18, 28]; //gst percentage list
  isVisiable = false;

  constructor(private readonly addProductService: ProductService) {}
  addProductForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    brandName: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    hsnCode: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    configuration: new FormControl('', [Validators.required]),
    purchasedPrice: new FormControl('', [
      Validators.pattern(/^([1-9])([0-9])*$/),
      Validators.minLength(1),
      Validators.maxLength(8),
    ]),
    gstpercentage: new FormControl('', [Validators.required]),
  });

  itemInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters
    if (inputElement.value.length > 8) {
      inputElement.value = inputElement.value.slice(0, 40);
    }
  }

  numberInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');

    // Ensure only 8 digits are allowed
    if (inputElement.value.length > 8) {
      inputElement.value = inputElement.value.slice(0, 8);
    }
  }
  numberInput1(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');

    // Ensure only 8 digits are allowed
    if (inputElement.value.length > 10) {
      inputElement.value = inputElement.value.slice(0, 10);
    }
  }

  addProduct(data: any) {
    console.log(data);

    let productList = {
      ...data,
      createdBy: sessionStorage.getItem('userId'),
      createdOn: new Date(),
    };
    console.log(productList);

    this.addProductService.addProduct(productList).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error.error);
        if (error.status == 201) {
          console.log(error.error.text);
          this.isVisiable = true;
          setTimeout(() => {
            this.isVisiable = false;
          }, 3000);
          this.addProductForm.reset();
        }
      },
    );
  }
}
