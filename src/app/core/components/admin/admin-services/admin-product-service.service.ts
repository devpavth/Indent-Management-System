import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminProductServiceService {
  constructor() {}
  public productCode: string | undefined;
  public employeeDelete: boolean | undefined;
  public employeeCode: any | undefined;
}
