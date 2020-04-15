import { TestBed } from '@angular/core/testing';

import { DilucionesService } from './diluciones.service';

describe('DilucionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DilucionesService = TestBed.get(DilucionesService);
    expect(service).toBeTruthy();
  });
});
