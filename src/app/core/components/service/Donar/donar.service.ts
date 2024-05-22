import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DonarService {
  constructor(private http: HttpClient) {}
  addDonar(donarData: any) {
    return this.http.post(environment.addDonar, donarData);
  }
}
