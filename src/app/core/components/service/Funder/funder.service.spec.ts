import { TestBed } from '@angular/core/testing';

import { FunderService } from './funder.service';

describe('FunderService', () => {
  let service: FunderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
