import { Injectable } from '@angular/core';
import { ProRequestdata } from '../../../models/proRequestData/pro-requestdata.model';

@Injectable({
  providedIn: 'root',
})
export class ProcurementQuotedataService {
  requestData: ProRequestdata | null = null;

  constructor() {}

  setData(data: ProRequestdata) {
    this.requestData = data;
  }

  getData(): ProRequestdata | null {
    return this.requestData;
  }
}
