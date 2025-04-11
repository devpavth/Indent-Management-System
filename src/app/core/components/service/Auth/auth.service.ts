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
    return localStorage.getItem('access_token');
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }

  getUserRoles(): string[] {
    const storedRoles = sessionStorage.getItem('roles');
    console.log('storedRoles:', storedRoles);
    return storedRoles ? JSON.parse(storedRoles) : [];
  }

  isAuthenticateEditIndentRole(): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes('ROLE_INDENT_DETAILS_EDITOR');
  }

  isAuthenticateUser(): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes('ROLE_USER');
  }

  isAuthenticateProgramManager(): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes('ROLE_PROGRAM_AUTH');
  }

  isAuthenticateBranchManager(): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes('ROLE_BRANCH_AUTH');
  }

  isAuthenticateAdmin() {
    const userRoles = this.getUserRoles();
    return userRoles.includes('ROLE_ADMIN_AUTH');
  }
}
