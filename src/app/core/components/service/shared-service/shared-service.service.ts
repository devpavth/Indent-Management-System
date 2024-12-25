import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { EmployeeServiceService } from '../Employee/employee-service.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  constructor(
    private http: HttpClient,
    private empService: EmployeeServiceService,
  ) {}
  public loginUserData: any;

  data: any;
  a = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ];
  b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  public userData: any;
  private uniqueToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJqYWdhbmVkaXR6QGdtYWlsLmNvbSIsImFwaV90b2tlbiI6IlhUMWI1a0V4eFhUM25DYzExTXV2cmI1Z2dNbFpsR0J6cWhVMTRUZ1JxX05sTnE2V1drUDlQNFIwOTdWYzJCaEtHT2cifSwiZXhwIjoxNzE2NTIyMzcyfQ.HYLXEKxo5pq2PM-UwScHHTMFCviFLLno4LsaCwVSljU';

  private headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: `Bearer ${this.uniqueToken}`,
    'Bypass-Common-Token': 'true',
  });

  getState(data: any) {
    return this.http.get(environment.countrySateCity + 'Country/' + data);
  }
  getCity(data: any) {
    return this.http.get(environment.countrySateCity + data);
  }
  getAllCountry() {
    return this.http.get(environment.allCountry, { headers: this.headers });
  }
  getAllState(data: any) {
    return this.http.get(environment.allState + data, {
      headers: this.headers,
    });
  }
  getAllCity(data: any) {
    return this.http.get(environment.allCity + data, {
      headers: this.headers,
    });
  }

  fetchPincode(pincode: any){
    console.log("environment.searchPincode + pincode:", environment.searchPincode + pincode);
    return this.http.get(environment.searchPincode + pincode);
  }

  gstCalculation(qty: any, unitPrice: any, gstpercentage: any) {
    let gstAmt = qty * unitPrice * (gstpercentage / 100);
    let itemPrice = qty * unitPrice + gstAmt;
    let calVal = { gstAmt, itemPrice };
    return calVal;
  }

  calculateDateDifference(timestamp: number): string {
    console.log(timestamp);

    const currentDate = new Date();
    const pastDate = new Date(timestamp * 1000); // Convert timestamp to milliseconds

    const differenceInSeconds = Math.floor(
      (currentDate.getTime() - pastDate.getTime()) / 1000,
    );

    const days = Math.floor(differenceInSeconds / (60 * 60 * 24));
    const hours = Math.floor(
      (differenceInSeconds % (60 * 60 * 24)) / (60 * 60),
    );
    const minutes = Math.floor((differenceInSeconds % (60 * 60)) / 60);
    const seconds = differenceInSeconds % 60;

    let differenceString = '';

    if (days > 0) {
      differenceString += days + ' days, ';
    }
    if (hours > 0 && days == 0) {
      differenceString += hours + ' Hrs, ';
    }
    if (minutes > 0 && days == 0) {
      differenceString += minutes + ' Min ';
    }
    // differenceString += seconds + ' seconds';

    return differenceString;
  }
  inWords(num: number): string {
    if (num.toString().length > 12) return 'Amount too large'; // Adjusting length check for larger amounts

    const numStr = num.toFixed(2); // Ensure two decimal places for paisa
    const parts = numStr.split('.');
    const rupees = parseInt(parts[0], 10);
    const paisa = Math.round(parseFloat('0.' + parts[1]) * 100); // Round paisa to nearest whole number

    const n = ('000000000' + rupees)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';

    let str = '';

    str +=
      Number(n[1]) !== 0
        ? (this.a[Number(n[1])] ||
            this.b[Number(n[1][0])] + ' ' + this.a[Number(n[1][1])]) + 'crore '
        : '';
    str +=
      Number(n[2]) !== 0
        ? (this.a[Number(n[2])] ||
            this.b[Number(n[2][0])] + ' ' + this.a[Number(n[2][1])]) + 'lakh '
        : '';
    str +=
      Number(n[3]) !== 0
        ? (this.a[Number(n[3])] ||
            this.b[Number(n[3][0])] + ' ' + this.a[Number(n[3][1])]) +
          'thousand '
        : '';
    str +=
      Number(n[4]) !== 0
        ? (this.a[Number(n[4])] ||
            this.b[Number(n[4][0])] + ' ' + this.a[Number(n[4][1])]) +
          'hundred '
        : '';

    if (str !== '') {
      str += 'and ';
    }

    str +=
      Number(n[5]) !== 0
        ? (this.a[Number(n[5])] ||
            this.b[Number(n[5][0])] + ' ' + this.a[Number(n[5][1])]) + 'Rupees '
        : '';

    if (paisa !== 0) {
      str +=
        'and ' +
        (this.a[paisa] ||
          this.b[Math.floor(paisa / 10)] + ' ' + this.a[paisa % 10]) +
        'paisa ';
    }

    str += 'only';

    return str.replace(/\sundefined/g, ''); // Remove 'undefined' if any part is not present
  }
}
