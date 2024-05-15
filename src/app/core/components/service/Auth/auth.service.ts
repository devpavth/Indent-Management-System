import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router,
  ) {}

  login(data: any) {
    return this.http.post(environment.login, data);
  }

  verifiedID(Id: any) {
    let userId = new HttpParams();
    userId = userId.append('empId', Id);
    return this.http.post(environment.verifiedID, '', { params: userId });
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
}
