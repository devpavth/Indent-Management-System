import { TestBed } from '@angular/core/testing';

import { ProcurementQuotedataService } from './procurement-quotedata.service';

describe('ProcurementQuotedataService', () => {
  let service: ProcurementQuotedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementQuotedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
