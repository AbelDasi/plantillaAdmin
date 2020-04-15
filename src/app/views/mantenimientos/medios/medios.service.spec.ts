import { TestBed } from '@angular/core/testing';

import { MediosService } from './medios.service';

describe('MediosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediosService = TestBed.get(MediosService);
    expect(service).toBeTruthy();
  });
});
