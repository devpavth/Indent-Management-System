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

  fetchPincode(pincode: any) {
    console.log(
      'environment.searchPincode + pincode:',
      environment.searchPincode + pincode,
    );
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
}
