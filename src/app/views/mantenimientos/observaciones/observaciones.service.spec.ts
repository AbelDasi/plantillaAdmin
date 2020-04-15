import { TestBed } from '@angular/core/testing';

import { ObservacionesService } from './observaciones.service';

describe('ObservacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObservacionesService = TestBed.get(ObservacionesService);
    expect(service).toBeTruthy();
  });
});
