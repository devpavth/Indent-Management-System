import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServiceService } from '../../../service/shared-service/shared-service.service';
import { DonarService } from '../../../service/Donar/donar.service';

@Component({
  selector: 'app-add-donar',
  templateUrl: './add-donar.component.html',
  styleUrl: './add-donar.component.css',
})
export class AddDonarComponent implements OnInit {
  addDonorForm: FormGroup;
  _country: any;
  _state: any;
  _city: any;

  _donarCategory: any[] = [
    { located: 'Local Donor', value: 125 },
    { located: 'Existing Donor', value: 126 },
    { located: 'International Donor', value: 127 },
  ];

  ngOnInit(): void {
    this.fetchCountry();
  }
  constructor(
    private fb: FormBuilder,
    private readonly countryStateCity: SharedServiceService,
    private donorService: DonarService,
  ) {
    this.addDonorForm = this.fb.group({
      dfirstName: ['', [Validators.required]],
      dlastName: ['', [Validators.required]],
      dcontactNumber: ['', [Validators.required]],
      demailId: ['', [Validators.required]],
      dcategory: ['', [Validators.required]],
      daddress1: ['', [Validators.required]],
      daddress2: ['', [Validators.required]],
      dcity: ['', [Validators.required]],
      dcountry: ['', [Validators.required]],
      dstate: ['', [Validators.required]],
      dpinCode: ['', [Validators.required]],
    });
  }
  fetchCountry() {
    this.countryStateCity.getAllCountry().subscribe((res) => {
      console.log(res);
    });
  }
  fetchState(selectedValue: string) {
    console.log(selectedValue);

    this.countryStateCity.getState(selectedValue).subscribe((res) => {
      this._state = res;
    });
  }

  fetchCity(city: string) {
    this.countryStateCity.getCity(city).subscribe((res) => {
      this._city = res;
    });
  }
  submitDonarDetails(data: any) {
    console.log(data);
    this.donorService.addDonar(data).subscribe((res) => {
      console.log(res);
    });
  }
}
