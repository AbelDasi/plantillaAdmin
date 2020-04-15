import { TestBed } from '@angular/core/testing';

import { AcronimosService } from './acronimos.service';

describe('AcronimosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcronimosService = TestBed.get(AcronimosService);
    expect(service).toBeTruthy();
  });
});
