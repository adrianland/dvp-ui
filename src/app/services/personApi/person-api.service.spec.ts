/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersonApiService } from './person-api.service';

describe('Service: Api', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonApiService]
    });
  });

  it('should ...', inject([PersonApiService], (service: PersonApiService) => {
    expect(service).toBeTruthy();
  }));
});
