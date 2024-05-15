import { TestBed } from '@angular/core/testing';

import { AdminProductServiceService } from './admin-product-service.service';

describe('AdminProductServiceService', () => {
  let service: AdminProductServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProductServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
