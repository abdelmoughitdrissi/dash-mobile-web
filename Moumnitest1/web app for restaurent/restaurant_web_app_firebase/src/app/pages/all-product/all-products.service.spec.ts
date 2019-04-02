import { TestBed, inject } from '@angular/core/testing';

import { AllProductsService } from './all-products.service';

describe('AllProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllProductsService]
    });
  });

  it('should ...', inject([AllProductsService], (service: AllProductsService) => {
    expect(service).toBeTruthy();
  }));
});
