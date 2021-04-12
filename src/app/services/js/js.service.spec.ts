import { TestBed } from '@angular/core/testing';

import { JsService } from './js.service';

describe('JsService', () => {
  let service: JsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
