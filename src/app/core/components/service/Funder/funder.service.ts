import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FunderService {
  constructor(private http: HttpClient) {}

  registerFunder(data: object) {
    return this.http.post(environment.addFunder, data);
  }
  funderList() {
    return this.http.get(environment.getAllFunderList);
  }
}
