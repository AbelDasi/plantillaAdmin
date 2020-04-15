import { TestBed } from '@angular/core/testing';

import { LegislacionService } from './legislacion.service';

describe('LegislacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegislacionService = TestBed.get(LegislacionService);
    expect(service).toBeTruthy();
  });
});
