import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  constructor(private http: HttpClient) {}
  public loginUserData: any;
  public userData: any;

  getState(data: any) {
    return this.http.get(environment.countrySateCity + 'Country/' + data);
  }
  getCity(data: any) {
    return this.http.get(environment.countrySateCity + data);
  }
}
