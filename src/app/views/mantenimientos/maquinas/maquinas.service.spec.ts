import { TestBed } from '@angular/core/testing';

import { MaquinasService } from './maquinas.service';

describe('MaquinasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaquinasService = TestBed.get(MaquinasService);
    expect(service).toBeTruthy();
  });
});
