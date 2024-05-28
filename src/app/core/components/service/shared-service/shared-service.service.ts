import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  constructor(private http: HttpClient) {}
  public loginUserData: any;

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
}
