import { TestBed } from '@angular/core/testing';

import { LaboratoriesService } from './laboratories.service';

describe('LaboratoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaboratoriesService = TestBed.get(LaboratoriesService);
    expect(service).toBeTruthy();
  });
});
